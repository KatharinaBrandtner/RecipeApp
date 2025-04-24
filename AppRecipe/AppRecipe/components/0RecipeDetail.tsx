import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import Heading from "./0Title";
import { useTheme } from "./0ThemeContext";

type Recipe = {
  name?: string;
  description?: string;
  image?: string;
  strMealThumb?: string;
  strMeal?: string;
  strInstructions?: string;
  strCategory?: string;
  strArea?: string;
};

type Props = {
  recipe: Recipe;
  isDarkMode: boolean;
  source: "my" | "search";
};

export default function RecipeDetailView({
  recipe,
  isDarkMode,
  source,
}: Props) {
  const { theme } = useTheme();

  const backgroundImage = isDarkMode
    ? require("../assets/images/detail-bg-bw.png")
    : require("../assets/images/detail-bg-color.png");

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: "en-US",
      rate: 1.0,
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        background: {
          flex: 1,
          resizeMode: "cover",
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
        image: {
          width: "100%",
          height: 250,
          borderRadius: 12,
          marginBottom: 20,
        },
        separator: {
          height: 1,
          marginBottom: 20,
          backgroundColor: theme.colors.black,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        },
        loud: {
          textDecorationLine: "underline",
          ...theme.typography.small,
          color: theme.colors.black,
          marginBottom: 10,
        },
        description: {
          ...theme.typography.body,
          color: theme.colors.black,
        },
        area: {
          ...theme.typography.small,
          color: theme.colors.black,
          marginBottom: 10,
        },
        spacer: {
          width: 20,
        },
        icon: {
          marginRight: 4,
        },
      }),
    [theme]
  );

  const title = recipe.name || recipe.strMeal;
  const image = recipe.image || recipe.strMealThumb;
  const description = recipe.description || recipe.strInstructions;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.innerContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <Heading withMargin={true} text={title || "No title"} />

          {source === "search" && (
            <Text style={styles.area}>
              {recipe.strCategory} | {recipe.strArea}
            </Text>
          )}

          <View style={styles.separator} />

          <View style={styles.row}>
            <TouchableOpacity onPress={() => speak(description || "")}>
              <Text style={styles.loud}>
                <Ionicons
                  name="megaphone-outline"
                  size={16}
                  color={theme.colors.black}
                />{" "}
                Read out loud
              </Text>
            </TouchableOpacity>
            <View style={styles.spacer} />
            <TouchableOpacity onPress={stopSpeaking}>
              <Text style={styles.loud}>
                <Ionicons
                  name="stop-outline"
                  size={16}
                  color={theme.colors.black}
                />{" "}
                Stop reading
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{description}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
