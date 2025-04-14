import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView,ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/ThemeContext';

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const { isDarkMode, theme } = useTheme();
  const [recipe, setRecipe] = useState<any>(null);

  const backgroundImage = isDarkMode
    ? require('../../assets/images/detail-bg-bw.png')
    : require('../../assets/images/detail-bg-color.png');

  useEffect(() => {
    const loadRecipe = async () => {
      const stored = await AsyncStorage.getItem('recipes');
      if (stored) {
        const all = JSON.parse(stored);
        const found = all.find((r: any) => r.id.toString() === id);
        setRecipe(found);
      }
    };
    loadRecipe();
  }, [id]);

  if (!recipe) return <Text>Loading...</Text>;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={[styles.title, theme.typography.h1, { color: theme.colors.black }]}>{recipe.name}</Text>
      <Text style={[theme.typography.body,  { color: theme.colors.black }]}>{recipe.description}</Text>
    </ScrollView>
    </ImageBackground>
  );
};

export default RecipeDetail;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
});
