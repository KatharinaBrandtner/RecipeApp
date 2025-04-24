import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/components/0ThemeContext";
import RecipeDetailView from "@/components/0RecipeDetail";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      const stored = await AsyncStorage.getItem("recipes");
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
    <RecipeDetailView recipe={recipe} isDarkMode={isDarkMode} source="my" />
  );
}
