// read out loud imolemnetieren

import { View, Text, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

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
          <Text style={[styles.title, theme.typography.h1, {color: theme.colors.black}]}>{recipe.strMeal}</Text>
          <Text style={[styles.area, theme.typography.small, {color: theme.colors.black}]}>{recipe.strCategory} | {recipe.strArea}</Text>
          <View style={[styles.separator, { backgroundColor: theme.colors.black }]} />
          <Text style={[styles.loud, theme.typography.small, {color: theme.colors.black}]}><Ionicons name="megaphone-outline" size={16} color={theme.colors.black} /> Read out loud</Text>
          <Text style={[theme.typography.body,  {color: theme.colors.black}]}>{recipe.strInstructions}</Text>
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
    marginBottom: 0,
  },
  area: {
    marginBottom: 10,
  },
  loud: {
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  separator: {
    height: 1,
    marginTop: 0,
    marginBottom: 20,
  },
});

export default SearchDetailScreen;
