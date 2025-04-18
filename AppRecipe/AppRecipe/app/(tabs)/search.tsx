import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, Image, TouchableOpacity,
  StyleSheet, ImageBackground, Modal
} from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useRouter } from 'expo-router';

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
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`,     // Name
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTerm}`,     // Kategorie
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchTerm}`,     // Area
      ];
  
      const responses = await Promise.all(queries.map(url => fetch(url)));
      const jsonData = await Promise.all(responses.map(res => res.json()));
  
      const mealsByName = jsonData[0].meals || [];
      const mealsByCategory = jsonData[1].meals || [];
      const mealsByArea = jsonData[2].meals || [];
  
      // 👇 Kombiniere und filtere Duplikate per ID
      const allMeals = [...mealsByName, ...mealsByCategory, ...mealsByArea];
      const uniqueMeals = Object.values(
        allMeals.reduce((acc: any, meal: any) => {
          acc[meal.idMeal] = meal;
          return acc;
        }, {})
      );
  
      // 👉 wenn `filter.php` verwendet wird, fehlt `strInstructions`
      // ➤ hole vollständige Details nach
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
      card: {
        flexDirection: 'row',
        marginBottom: 20,
      },
      image: {
        ...theme.imageCard,
        marginRight: 12,
      },
      content: {
        flex: 1,
        justifyContent: 'center',
      },
      title: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.black,
      },
      description: {
        ...theme.typography.body,
        color: theme.colors.black,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
      },
      randomButton: {
        backgroundColor: theme.colors.blue_search,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
      },
      randomButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.white_search,
      },
      loadingText: {
        color: theme.colors.black,
        marginTop: 20,
      },
      separatorCards: {
        height: 1,
        marginBottom: 20,
        backgroundColor: theme.colors.black,
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
    <TouchableOpacity onPress={() => router.push(`/search/${item.idMeal}`)}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setSelectedImage(item.strMealThumb)}>
          <Image source={{ uri: item.strMealThumb }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title}>{item.strMeal}</Text>
          <Text numberOfLines={2} style={styles.description}>
            {item.strInstructions}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
          <TouchableOpacity style={styles.randomButton} onPress={getRandomRecipe}>
            <Text style={styles.randomButtonText}>Random</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Text style={styles.loadingText}>Suche läuft...</Text>
        ) : results.length === 0 && query.trim().length > 1 ? (
          <Text style={styles.loadingText}>Keine Ergebnisse gefunden.</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.idMeal}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View style={styles.separatorCards} />
            )}
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
