// wenn kein image selectet dann beisoiel bild aus image dolder anbinden
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Pressable, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/ThemeContext';

const { width, height } = Dimensions.get('window');

const NewRecipeScreen = () => {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();  

  const backgroundImage = isDarkMode
    ? require('../../assets/images/new-bg-bw.png')
    : require('../../assets/images/new-bg-color.png');
    
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
      image,
    };

    try {
      const existing = await AsyncStorage.getItem('recipes');
      const recipes = existing ? JSON.parse(existing) : [];
      const updated = [...recipes, newRecipe];
      await AsyncStorage.setItem('recipes', JSON.stringify(updated));
      alert('Recipe saved!');
      setName('');
      setDescription('');
      setImage(null);
    } catch (e) {
      console.error('Error saving recipe:', e);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={[theme.typography.h1, { color: theme.colors.black }, styles.heading]}>New Recipe</Text>
        
        <View style={[styles.inputContainer, {borderColor: theme.colors.black}, theme.typography.body]}>
          <TextInput
              placeholder="Recipe Name"
              value={name}
              onChangeText={setName}
              style={[styles.input, theme.typography.body]}
              placeholderTextColor={theme.colors.black}
            />
            <View style={styles.divider} />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { height: 100, textAlignVertical: 'top',  paddingHorizontal: 13,}, theme.typography.body]}
              placeholderTextColor={theme.colors.black}
              multiline
            />
            <View style={[styles.divider, {}]} />
              <Pressable onPress={pickImage} style={styles.imagePicker}>
                <Text style={[{ color: theme.colors.black }, {fontSize: 16}, theme.typography.body]}>
                  {image ? 'Image Selected' : 'Select Image'}
                </Text>
              </Pressable>
            </View>

          {image && <Image source={{ uri: image }} style={styles.preview} />}

          <Pressable onPress={saveRecipe} style={({ pressed }) => [
            { backgroundColor: 'transparent'},
          ]}>
            {({ pressed }) => (
              <Text style={[theme.typography.body,{
                color: pressed ? theme.colors.black : theme.colors.black,
                fontWeight: pressed ? 'bold' : 'normal',
                textAlign: 'center',
                borderWidth: pressed ? '3' : '1',
                borderColor: '#0e0e12',
                borderRadius: 12,
                paddingVertical: 14,
                width: '100%',
              }]}>
                Save
              </Text>
            )}
          </Pressable>
        </View>
    </ImageBackground>
  );
};

export default NewRecipeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    paddingTop: 80,
    flex: 1,
  },
  heading: {
    marginBottom: 20,
  },
  preview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#0e0e12',
    marginVertical: 6,
  },
  imagePicker: {
    padding: 12,
  },  
});

