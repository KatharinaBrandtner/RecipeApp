import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/app/contextprovider/0ThemeContext";
import RecipeDetailView from "@/components/0RecipeDetail";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams(); //Holt die id aus den lokalen Suchparametern der URL (Expo Router)
  const { isDarkMode } = useTheme();
  const [recipe, setRecipe] = useState<any>(null);  //State um Rezept zu speichern

  useEffect(() => {
    const loadRecipe = async () => { //Funktion zum Laden des Rezepts aus AsyncStorage
      const stored = await AsyncStorage.getItem("recipes");
      if (stored) {
        const all = JSON.parse(stored); //JSON string in Array
        const found = all.find((r: any) => r.id.toString() === id); //Sucht das Rezept mit der passenden id
        setRecipe(found);
      }
    };
    loadRecipe();
  }, [id]); //useEffect wird jedes Mal ausgeführt, wenn sich `id` ändert

  if (!recipe) return <Text>Loading...</Text>;

  return (
    <RecipeDetailView recipe={recipe} isDarkMode={isDarkMode} source="my" />
  );
}
