import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, Image, TouchableOpacity,
  StyleSheet, ImageBackground, Modal
} from 'react-native';
import { useTheme } from '@/app/contextprovider/0ThemeContext';
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

  const [query, setQuery] = useState(''); //aktueller suchbegriff
  const [results, setResults] = useState<Meal[]>([]); // ergebnisse in liste
  const [isLoading, setIsLoading] = useState(false); //wird gerade gesucht?
  const [selectedImage, setSelectedImage] = useState<string|null>(null);

  useEffect(() => { //wenn sich such input ändert, wartet aber 600ms bis neu gesucht wird (debouncing)
    const delayDebounce = setTimeout(() => { 
      if (query.trim().length > 1) { //suche länger als 1 zeichen?
        searchMeals(query); //suche wird durchgeführt
      } else {
        setResults([]); //wenn 0 zeichen dann leere suche
      }
    }, 600); 

    return () => clearTimeout(delayDebounce); //vorheriges timeout abgebrochen wenn weiter tippen 
  }, [query]); //jedes mal wenn neues zeichen eingegeben

  //suchen in mealdb, dublikate entfernt
  const searchMeals = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const queries = [
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`,     
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTerm}`,     
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchTerm}`,   
      ];
  
      // Führt alle Abfragen gleichzeitig aus
      const responses = await Promise.all(queries.map(url => fetch(url)));
      const jsonData = await Promise.all(responses.map(res => res.json())); //alles in json konvertiert
  
      const mealsByName = jsonData[0].meals || [];
      const mealsByCategory = jsonData[1].meals || [];
      const mealsByArea = jsonData[2].meals || [];

      const allMeals = [...mealsByName, ...mealsByCategory, ...mealsByArea]; //kombi aller rezepte
      const uniqueMeals = Object.values(
        allMeals.reduce((acc: any, meal: any) => { //löscht doppeltes durch idMeal gruppierung
          acc[meal.idMeal] = meal; // idMeals als Key
          return acc;
        }, {})
      );
      
      //alle nötogen infos bekommen für rezepte aus der liste
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
  
      setResults(detailedMeals); //Setzt die Ergebnisse im State
    } catch (error) {
      console.error('Error with API:', error);
    } finally {
      setIsLoading(false); //Loading-Zustand wieder auf `false` wenn Anfrage abgeschlossen 
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
            placeholder="Search a recipe..."
            placeholderTextColor={theme.colors.black}
            style={styles.input}
          />
          <CustomButton type="random" text="Random" onPress={getRandomRecipe} />
        </View>

        {isLoading ? ( //isLoading true dann zeigt Ladeanzeige
          <Text style={styles.loadingText}>searching...</Text>
        ) : results.length === 0 && query.trim().length > 1 ? ( //wenn kein Ergebnis und input mehr als ein Zeichen
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
