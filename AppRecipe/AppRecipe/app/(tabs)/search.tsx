import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, Image, TouchableOpacity,
  StyleSheet, ImageBackground, Modal
} from 'react-native';
import { useTheme } from '@/components/0ThemeContext';
import { useRouter } from 'expo-router';
import RecipeCard from '@/components/0RecipeCard';
import CustomButton from '@/components/0Button';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
}

export default function SearchRecipes(){
  const { isDarkMode, theme } = useTheme();  
  const router = useRouter();

  const backgroundImage = isDarkMode
    ? require('../../assets/images/my-bg-bw.png')
    : require('../../assets/images/search-bg-color.png');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string|null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        searchMeals(query);
      } else {
        setResults([]);
      }
    }, 600); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchMeals = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const queries = [
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`,     
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTerm}`,     
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchTerm}`,   
      ];
  
      const responses = await Promise.all(queries.map(url => fetch(url)));
      const jsonData = await Promise.all(responses.map(res => res.json()));
  
      const mealsByName = jsonData[0].meals || [];
      const mealsByCategory = jsonData[1].meals || [];
      const mealsByArea = jsonData[2].meals || [];

      const allMeals = [...mealsByName, ...mealsByCategory, ...mealsByArea];
      const uniqueMeals = Object.values(
        allMeals.reduce((acc: any, meal: any) => {
          acc[meal.idMeal] = meal;
          return acc;
        }, {})
      );
      
      const detailedMeals = await Promise.all(
        uniqueMeals.map(async (meal: any) => {
          if (!meal.strInstructions) {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const data = await res.json();
            return data.meals?.[0] || meal;
          }
          return meal;
        })
      );
  
      setResults(detailedMeals);
    } catch (error) {
      console.error('Fehler bei der API:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const getRandomRecipe = async () => {
    try {
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        const randomMeal = data.meals[0];
        router.push(`/search/${randomMeal.idMeal}`);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Zufallsrezepts:', error);
    }
  };

  const styles = useMemo(() =>
    StyleSheet.create({
      background: {
        ...theme.background,
      },
      container: {
        ...theme.container,
        paddingTop: 60,
      },
      input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        width: '70%',
        color: theme.colors.black,
        borderColor: theme.colors.black,
        backgroundColor: 'transparent'
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
      },
      loadingText: {
        color: theme.colors.black,
        marginTop: 20,
      },
      modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
      },
      fullscreenImage: {
        width: "90%",
        height: "80%",
        borderRadius: 16,
      },
    }), [theme]
  );

  const renderItem = ({ item }: { item: Meal }) => (
    <RecipeCard
      id={Number(item.idMeal)}
      name={item.strMeal}
      description={item.strInstructions}
      image={item.strMealThumb}
      onDelete={() => {}}
      onPress={() => router.push(`/search/${item.idMeal}`)}
      onImagePress={() => setSelectedImage(item.strMealThumb)}
      showDeleteButton={false}
    />
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.row}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Suche ein Rezept..."
            placeholderTextColor={theme.colors.black}
            style={styles.input}
          />
          <CustomButton type="random" text="Random" onPress={getRandomRecipe} />
        </View>

        {isLoading ? (
          <Text style={styles.loadingText}>searching...</Text>
        ) : results.length === 0 && query.trim().length > 1 ? (
          <Text style={styles.loadingText}>no results</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.idMeal}
            renderItem={renderItem}
            
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        <Modal visible={!!selectedImage} transparent animationType="fade">
          <TouchableOpacity style={styles.modalContainer} onPress={() => setSelectedImage(null)}>
            <Image
              source={{ uri: selectedImage! }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      </View>
    </ImageBackground>
  );
};
