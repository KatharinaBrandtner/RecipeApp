import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/app/contextprovider/0ThemeContext";
import RecipeDetailView from "@/components/0RecipeDetail";

export default function SearchDetailScreen() {
  const { id } = useLocalSearchParams(); //Holt die id aus den lokalen Suchparametern der URL (Expo Router)
  const { isDarkMode } = useTheme();
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}` //API-Endpunkt um Rezept mit ID zu finden
        );
        const data = await response.json();
        setRecipe(data.meals[0]);
      } catch (err) {
        console.error("Misstake loading recipes:", err);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) { //Wenn Rezept noch nicht geladen
    return (
      <View>
        <Text>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <RecipeDetailView recipe={recipe} isDarkMode={isDarkMode} source="search" />
  );
}
