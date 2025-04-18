import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './0ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface RecipeCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  onDelete: () => void;
  onPress: () => void;
  onImagePress: () => void;
}

const RecipeCard = ({
  id,
  name,
  description,
  image,
  onDelete,
  onPress,
  onImagePress,
}: RecipeCardProps) => {
  const { isDarkMode, theme } = useTheme();
  
  return (
    <TouchableOpacity onPress={onPress}>
    <View style={[styles.card]}>
      <View style={styles.cardContent}>
        <TouchableOpacity onPress={onImagePress}>
          <Image source={{ uri: image }} style={styles.imageCard} />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={[styles.middle, theme.typography.bigger, { color: isDarkMode ? theme.colors.white : theme.colors.black }]}>
            {name}
          </Text>
          <Text style={[theme.typography.body, { color: isDarkMode ? theme.colors.white : theme.colors.black }]} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color={theme.colors.black} />
      </TouchableOpacity>

      <View style={[styles.separatorCards, { backgroundColor: isDarkMode ? theme.colors.white : theme.colors.black }]} />
    </View>
  </TouchableOpacity>
);
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: 'transparent'
  },
  cardContent: {
    flexDirection: "row",
    padding: 15,
  },
  imageCard: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  middle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  separatorCards: {
    height: 1,
    marginTop: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
  },
});

export default RecipeCard;
