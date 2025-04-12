import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../components/ThemeContext';  // Stelle sicher, dass der Pfad stimmt

export default function Home() {
  const { theme, toggleTheme } = useTheme();  // Hol dir das Theme und eine Funktion zum Umschalten

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text>Home Screen</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
}
