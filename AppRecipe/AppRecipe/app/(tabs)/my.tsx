import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/ThemeContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
}

const MyRecipesScreen = () => {
  const { isDarkMode, theme } = useTheme();
  const router = useRouter();
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const backgroundImage = isDarkMode
    ? require('../../assets/images/my-bg-bw.png')
    : require('../../assets/images/my-bg-color.png');

  // Funktion zum Laden der Rezepte
  const loadRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      if (storedRecipes) {
        setRecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error('Fehler beim Laden der Rezepte:', error);
    }
  };
  
  useEffect(() => {
    loadRecipes();
  }, []);
  
  const deleteRecipe = async (id: number) => {
    try {
      const filteredRecipes = recipes.filter((recipe) => recipe.id !== id);
      await AsyncStorage.setItem('recipes', JSON.stringify(filteredRecipes));
      setRecipes(filteredRecipes);
    } catch (error) {
      console.error('Fehler beim Löschen des Rezepts:', error);
    }
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity onPress={() => router.push(`/my/${item.id}`)}>
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity onPress={() => setSelectedImage(item.image)}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.black }]}>{item.name}</Text>
          <Text
            style={[styles.description, { color: theme.colors.grey }]}
            numberOfLines={3}
            ellipsizeMode="tail">
            {item.description}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => deleteRecipe(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color={theme.colors.red} />
      </TouchableOpacity>

      <View style={[styles.separator, { backgroundColor: theme.colors.grey }]} />
    </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.heading, { color: theme.colors.black }]}>My Recipes</Text>
          
          {/* Refresh Button */}
          <TouchableOpacity onPress={loadRecipes} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={24} color={theme.colors.black} />
          </TouchableOpacity>
        </View>

        {recipes.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.grey }]}>
            Noch keine Rezepte gespeichert.
          </Text>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRecipe}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        <Modal visible={!!selectedImage} transparent animationType="fade">
          <TouchableOpacity style={styles.modalContainer} onPress={() => setSelectedImage(null)}>
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
};

export default MyRecipesScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    flexDirection: 'column',
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '80%',
    borderRadius: 16,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
});
