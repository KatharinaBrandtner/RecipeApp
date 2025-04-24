import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/components/0ThemeContext";
import RecipeDetailView from "@/components/0RecipeDetail";

export default function SearchDetailScreen() {
  const { id } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        setRecipe(data.meals[0]);
      } catch (err) {
        console.error("Misstake loading recipes:", err);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
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
