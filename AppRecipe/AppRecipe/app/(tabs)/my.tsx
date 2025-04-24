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
import { useTheme } from "@/components/0ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRecipes } from "@/components/0RecipeContext";
import RecipeCard from "@/components/0RecipeCard";
import Heading from "../../components/0Title";

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
}

export default function MyRecipesScreen() {
  const { isDarkMode, theme } = useTheme();
  const router = useRouter();

  const { recipes, deleteRecipe, loadRecipes } = useRecipes();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const backgroundImage = isDarkMode
    ? require("../../assets/images/my-bg-bw.png")
    : require("../../assets/images/my-bg-color.png");

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <RecipeCard
      id={item.id}
      name={item.name}
      description={item.description}
      image={item.image}
      onDelete={() => deleteRecipe(item.id)}
      onPress={() => router.push(`/my/${item.id}`)}
      onImagePress={() => setSelectedImage(item.image)}
    />
  );

  const [sortOption, setSortOption] = useState("newest");

  const sortRecipes = (list: Recipe[], option: string): Recipe[] => {
    let sortedList = [...list];
    switch (option) {
      case "a-z":
        sortedList = sortedList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        sortedList = sortedList.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "oldest":
        sortedList = sortedList.sort((a, b) => a.id - b.id);
        break;
      case "newest":
      default:
        sortedList = sortedList.sort((a, b) => b.id - a.id);
        break;
    }
    return sortedList;
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
          <Heading withMargin={true} text="My Recipes" />
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
