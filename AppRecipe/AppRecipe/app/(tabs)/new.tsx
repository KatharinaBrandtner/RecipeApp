import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/app/contextprovider/0ThemeContext";
import { useRecipes } from "@/app/contextprovider/0RecipeContext";
import Heading from "../../components/0Title";
import CustomButton from "../../components/0Button";

const fallbackImage = require("../../assets/images/placeholder_food.png");

export default function NewRecipeScreen() {
  const { isDarkMode, theme } = useTheme();

  const { addRecipe } = useRecipes();

  const backgroundImage = isDarkMode
    ? require("../../assets/images/new-bg-bw.png")
    : require("../../assets/images/new-bg-color.png");
    
//State manger usestate-hooks
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
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
    addRecipe(newRecipe);
    setName("");
    setDescription("");
    setImage(null);
    alert("Your recipe is saved :)");
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
      }),
    [theme]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.container}>
          <Heading withMargin={true} text="New Recipe" />

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

          <CustomButton type="save" text="Save" onPress={saveRecipe} />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
