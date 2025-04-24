import React, { createContext, useState, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: number) => void;
  loadRecipes: () => void;
}

// leerer Kontext für Rezepte
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// Kontext zur verfügung und verwaltet Zustand
export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Zustand

  const addRecipe = async (recipe: Recipe) => { 
    try {
      setRecipes((prevRecipes) => { 
        const updatedRecipes = [...prevRecipes, recipe]; //kopiert liste und fügt rest dazu
        AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes)); //wie localstorage, Key: recipes, rest in sting
        return updatedRecipes;
      });
    } catch (error) { 
      console.error("Error adding recipe:", error);
    }
  };

  const deleteRecipe = async (id: number) => {
    try {
      const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
      setRecipes(updatedRecipes);
      await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const loadRecipes = async () => {
    try {
      const savedRecipes = await AsyncStorage.getItem("recipes");
      if (savedRecipes) {
        const parsedRecipes = JSON.parse(savedRecipes); // wandelt json string zurück in array[] um
        setRecipes(parsedRecipes); 
      }
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  };

  return (
    <RecipeContext.Provider
      value={{ recipes, addRecipe, deleteRecipe, loadRecipes }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

// Sicherstellung das Kontext nnur in RecipeProvider genutzt wird
export const useRecipes = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
};
