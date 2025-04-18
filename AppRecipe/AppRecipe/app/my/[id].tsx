import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView,
  ImageBackground, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

export default function RecipeDetail() {
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
    image: {
      width: '100%',
      height: 250,
      borderRadius: 12,
      marginBottom: 20,
    },
    title: {
      ...theme.typography.h1,
      marginBottom: 20,
      color: theme.colors.black,
    },
    separator: {
      height: 1,
      marginBottom: 20,
      backgroundColor: theme.colors.black,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    loud: {
      marginBottom: 10,
      textDecorationLine: 'underline',
      ...theme.typography.small,
      color: theme.colors.black,
    },
    stop: {
      ...theme.typography.small,
      color: theme.colors.black,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.black,
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
    spacer: {
      width: 20,
    },
    
  }), [theme]);

  if (!recipe) return <Text>Loading...</Text>;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <Text style={styles.title}>{recipe.name}</Text>
          <View style={styles.separator} />
          <View style={styles.row}>
            <TouchableOpacity onPress={() => speak(recipe.description)}>
              <Text style={styles.loud}>
                <Ionicons name="megaphone-outline" size={16} color={theme.colors.black} /> Read out loud
              </Text>
            </TouchableOpacity>
            <View style={styles.spacer} />
            <TouchableOpacity onPress={stopSpeaking}>
              <Text style={styles.loud}>
                <Ionicons name="stop-outline" size={16} color={theme.colors.black} /> Stop reading
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>{recipe.description}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );  
}
