import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/components/ThemeContext";

const fallbackImage = require("../../assets/images/placeholder_food.png");

export default function NewRecipeScreen() {
  const { isDarkMode, theme } = useTheme();

  const backgroundImage = isDarkMode
    ? require("../../assets/images/new-bg-bw.png")
    : require("../../assets/images/new-bg-color.png");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveRecipe = async () => {
    const newRecipe = {
      id: Date.now(),
      name,
      description,
      image: image ?? Image.resolveAssetSource(fallbackImage).uri,
    };

    try {
      const existing = await AsyncStorage.getItem("recipes");
      const recipes = existing ? JSON.parse(existing) : [];
      const updated = [...recipes, newRecipe];
      await AsyncStorage.setItem("recipes", JSON.stringify(updated));
      alert("Recipe saved!");
      setName("");
      setDescription("");
      setImage(null);
    } catch (e) {
      console.error("Error saving recipe:", e);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        background: {
          ...theme.background,
        },
        container: {
          ...theme.container,
        },
        heading: {
          ...theme.typography.h1,
          color: theme.colors.black,
          marginBottom: 20,
        },
        inputContainer: {
          borderWidth: 1,
          borderColor: theme.colors.black,
          borderRadius: 12,
          marginBottom: 20,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: "transparent",
        },
        input: {
          paddingVertical: 10,
          paddingHorizontal: 13,
          ...theme.typography.body,
        },
        divider: {
          height: 1,
          backgroundColor: theme.colors.black,
          marginVertical: 6,
        },
        imagePicker: {
          padding: 12,
        },
        preview: {
          width: "100%",
          height: 200,
          marginBottom: 20,
          borderRadius: 12,
        },
        saveButton: {
          color: theme.colors.black,
          textAlign: "center",
          borderWidth: 1,
          borderColor: theme.colors.black,
          borderRadius: 12,
          paddingVertical: 14,
          width: "100%",
        },
      }),
    [theme]
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.heading}>New Recipe</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Recipe Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor={theme.colors.black}
          />
          <View style={styles.divider} />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholderTextColor={theme.colors.black}
            multiline
          />
          <View style={styles.divider} />
          <Pressable onPress={pickImage} style={styles.imagePicker}>
            <Text style={{ color: theme.colors.black, fontSize: 16 }}>
              {image ? "Image Selected" : "Select Image"}
            </Text>
          </Pressable>
        </View>
        
        {image && <Image source={{ uri: image }} style={styles.preview} />}

        <Pressable onPress={saveRecipe}>
          {({ pressed }) => (
            <Text
              style={[
                styles.saveButton,
                { fontWeight: pressed ? "bold" : "normal" },
              ]}
            >
              Save
            </Text>
          )}
        </Pressable>
      </View>
    </ImageBackground>
  );
}
