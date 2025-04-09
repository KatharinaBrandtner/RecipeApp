import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View} from 'react-native';
import React, { useState } from 'react';

import { ThemeProvider, useTheme } from './components/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import NewRecipeScreen from './screens/NewRecipeScreen';
import MyRecipesScreen from './screens/MyRecipesScreen';
import SearchRecipesScreen from './screens/SearchRecipesScreen';
import BottomNavBar from './components/Navbar';

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const MainApp = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); //aktueller Modus
  const [currentPage, setCurrentPage] = useState<'home' | 'new' | 'my' | 'search'>('home'); //welche Seite aktuell (angefangen mit home)

  const renderPage = () => { //zeigt den jeweiligen screen
    switch (currentPage) {
      case 'home': return <HomeScreen />;
      case 'new': return <NewRecipeScreen />;
      case 'my': return <MyRecipesScreen />;
      case 'search': return <SearchRecipesScreen />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0e0e12' : '#f5f5f5' }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} /> 
      <View style={styles.pageContainer}>{renderPage()}</View>
      <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
});
