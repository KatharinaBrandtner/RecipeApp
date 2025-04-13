import { View, Text, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeContext';

const SearchDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { isDarkMode, theme } = useTheme();
  const [recipe, setRecipe] = useState<any>(null);

  const backgroundImage = isDarkMode
    ? require('../../assets/images/detail-bg-bw.png')
    : require('../../assets/images/detail-bg-color.png');

  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
          const data = await response.json();
          setRecipe(data.meals[0]);
        } catch (err) {
          console.error('Fehler beim Laden:', err);
        }
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Lade Rezept...</Text>
      </View>
    );
  }

  return (
     <ImageBackground source={backgroundImage} style={styles.background}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
          <Text style={styles.title}>{recipe.strMeal}</Text>
          <Text style={styles.instructions}>{recipe.strInstructions}</Text>
        </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default SearchDetailScreen;
