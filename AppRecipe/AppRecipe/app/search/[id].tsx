import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView,
  ImageBackground, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

export default function SearchDetailScreen() {
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

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: 'en-US',
      rate: 1.0,
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
  };

  const styles = useMemo(() => StyleSheet.create({
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
      ...theme.typography.h1,
      color: theme.colors.black,
      marginBottom: 0,
    },
    area: {
      ...theme.typography.small,
      color: theme.colors.black,
      marginBottom: 10,
    },
    separator: {
      height: 1,
      marginTop: 0,
      marginBottom: 20,
      backgroundColor: theme.colors.black,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    loud: {
      ...theme.typography.small,
      color: theme.colors.black,
      marginBottom: 10,
      textDecorationLine: 'underline',
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.black,
    },
    spacer: {
      width: 20,
    },
    icon: {
      marginRight: 4,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    innerContainer: {
      flexGrow: 1,
    },
    
  }), [theme]);

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Lade Rezept...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
          <Text style={styles.title}>{recipe.strMeal}</Text>
          <Text style={styles.area}>
            {recipe.strCategory} | {recipe.strArea}
          </Text>
          <View style={styles.separator} />
  
          <View style={styles.row}>
            <TouchableOpacity onPress={() => speak(recipe.strInstructions)}>
              <Text style={styles.loud}>
                <Ionicons name="megaphone-outline" size={16} color={theme.colors.black} style={styles.icon} />
                Read out loud
              </Text>
            </TouchableOpacity>
  
            <View style={styles.spacer} />
  
            <TouchableOpacity onPress={stopSpeaking}>
              <Text style={styles.loud}>
                <Ionicons name="stop-outline" size={16} color={theme.colors.black} style={styles.icon} />
                Stop reading
              </Text>
            </TouchableOpacity>
          </View>
  
          <Text style={styles.description}>{recipe.strInstructions}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
  
};
