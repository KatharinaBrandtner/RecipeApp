import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import Heading from "./0Title";
import { useTheme } from "../app/contextprovider/0ThemeContext";

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

  const [isSpeaking, setIsSpeaking] = useState(false);

    //handy darf nicht auf lautlos sein!
  const toggleSpeech = (text: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.stop(); //verhindert überschnidung
      Speech.speak(text, { //vorlesen
        language: "en-US",
        rate: 1.0,
        onDone: () => setIsSpeaking(false), //zurücksetzen wenn fertig
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
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

  //weil my recipe und mealdb unterschiedliche benennungen
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

          {/* wenn Rezept aus Mealdb */}
          {source === "search" && (
            <Text style={styles.area}>
              {recipe.strCategory} | {recipe.strArea}
            </Text>
          )}

          <View style={styles.separator} />

          <TouchableOpacity onPress={() => toggleSpeech(description || "")}>
            <Text style={styles.loud}>
              {isSpeaking ? "Stop reading" : "Read out loud"}
            </Text>
          </TouchableOpacity>


          <Text style={styles.description}>{description}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
