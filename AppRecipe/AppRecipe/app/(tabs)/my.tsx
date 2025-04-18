import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/components/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
}

export default function MyRecipesScreen() {
  const { isDarkMode, theme } = useTheme();
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const backgroundImage = isDarkMode
    ? require("../../assets/images/my-bg-bw.png")
    : require("../../assets/images/my-bg-color.png");

  // Funktion zum Laden der Rezepte
  const loadRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem("recipes");
      if (storedRecipes) {
        setRecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error("Fehler beim Laden der Rezepte:", error);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const deleteRecipe = async (id: number) => {
    try {
      const filteredRecipes = recipes.filter((recipe) => recipe.id !== id);
      await AsyncStorage.setItem("recipes", JSON.stringify(filteredRecipes));
      setRecipes(filteredRecipes);
    } catch (error) {
      console.error("Fehler beim Löschen des Rezepts:", error);
    }
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity onPress={() => router.push(`/my/${item.id}`)}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <TouchableOpacity onPress={() => setSelectedImage(item.image)}>
            <Image source={{ uri: item.image }} style={styles.imageCard} />
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.middle,
                theme.typography.bigger,
                { color: theme.colors.black },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                
                theme.typography.body,
                { color: theme.colors.black },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => deleteRecipe(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color={theme.colors.black} />
        </TouchableOpacity>

        <View
          style={[
            styles.separatorCards,
            { backgroundColor: theme.colors.black },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  const [sortOption, setSortOption] = useState("newest");

  const sortRecipes = (list: Recipe[], option: string): Recipe[] => {
    switch (option) {
      case "a-z":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case "z-a":
        return [...list].sort((a, b) => b.name.localeCompare(a.name));
      case "oldest":
        return [...list].sort((a, b) => a.id - b.id);
      case "newest":
      default:
        return [...list].sort((a, b) => b.id - a.id);
    }
  };

  const sortedRecipes = sortRecipes(recipes, sortOption);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        background: {
          ...theme.background,
        },
        container: {
          ...theme.container,
        },
        h1: {
          ...theme.typography.h1,
          color: theme.colors.black,
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        },
        refreshButton: {
          padding: 10,
          borderRadius: 5,
        },
        emptyText: {
          marginTop: 40,
          ...theme.typography.body,
          color: theme.colors.black,
        },
        card: {
          ...theme.card,
        },
        cardContent: {
          ...theme.cardContent,
        },
        imageCard: {
          ...theme.imageCard,
        },
        textContainer: {
          flex: 1,
          justifyContent: "center",
          marginLeft: 10,
        },
        middle: {
          fontWeight: "600",
          marginBottom: 4,
          ...theme.typography.body,
        },
        
        separatorCards: {
          ...theme.separatorCards,
        },
        modalContainer: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.8)",
          justifyContent: "center",
          alignItems: "center",
        },
        fullscreenImage: {
          width: "90%",
          height: "80%",
          borderRadius: 16,
        },
        deleteButton: {
          position: "absolute",
          top: 10,
          right: 10,
          padding: 8,
        },
        sortingContainer: {
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 10,
        },
        sortOption: {
          ...theme.typography.body,
          marginHorizontal: 4,
          color: theme.colors.black,
        },
        activeSort: {
          fontWeight: "bold",
        },
        divider: {
          marginHorizontal: 4,
        },
      }),
    [theme]
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.h1}>My Recipes</Text>

          <TouchableOpacity onPress={loadRecipes} style={styles.refreshButton}>
            <Ionicons
              name="refresh-outline"
              size={24}
              color={theme.colors.black}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sortingContainer}>
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.black, marginRight: 8 },
            ]}
          >
            Sort:
          </Text>

          <TouchableOpacity onPress={() => setSortOption("newest")}>
            <Text
              style={[
                styles.sortOption,
                sortOption === "newest" && styles.activeSort,
              ]}
            >
              newest
            </Text>
          </TouchableOpacity>
          <Text style={styles.divider}>|</Text>
          <TouchableOpacity onPress={() => setSortOption("oldest")}>
            <Text
              style={[
                styles.sortOption,
                sortOption === "oldest" && styles.activeSort,
              ]}
            >
              oldest
            </Text>
          </TouchableOpacity>
          <Text style={styles.divider}>|</Text>
          <TouchableOpacity onPress={() => setSortOption("a-z")}>
            <Text
              style={[
                styles.sortOption,
                sortOption === "a-z" && styles.activeSort,
              ]}
            >
              A-Z
            </Text>
          </TouchableOpacity>
          <Text style={styles.divider}>|</Text>
          <TouchableOpacity onPress={() => setSortOption("z-a")}>
            <Text
              style={[
                styles.sortOption,
                sortOption === "z-a" && styles.activeSort,
              ]}
            >
              Z-A
            </Text>
          </TouchableOpacity>
        </View>

        {recipes.length === 0 ? (
          <Text style={styles.emptyText}>Noch keine Rezepte gespeichert.</Text>
        ) : (
          <FlatList
            data={sortedRecipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRecipe}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        <Modal visible={!!selectedImage} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={() => setSelectedImage(null)}
          >
            <Image
              source={{ uri: selectedImage! }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      </View>
    </ImageBackground>
  );
}
