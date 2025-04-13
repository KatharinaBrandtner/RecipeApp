// HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../components/ThemeContext';  


const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();  

  const backgroundImage = isDarkMode
    ? require('../../assets/images/home-bg-bw.png')
    : require('../../assets/images/home-bg-color.png');

  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.container]}
      resizeMode="cover"
    >
      <View style={styles.textWrapper}
     >
        <Text style={[styles.title, { color: theme.colors.black }, theme.typography.h1]}>
          Digital{'\n'}Cook{'\n'}Book
        </Text>

        <TouchableOpacity onPress={toggleDarkMode}>
          <Text style={[styles.toggleText, theme.typography.smalllink, { color: theme.colors.background }]}>
            Show {isDarkMode ? 'color mode' : 'black and white'} mode
          </Text>
        </TouchableOpacity>

        <Text style={[theme.typography.h1, { color: theme.colors.black }]}>
          Here you can{'\n'}
          find and{'\n'}
          collect the{'\n'}
          best recipes{'\n'}
          for your{'\n'}
          home made{'\n'}
          meals
        </Text>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    
  },
  textWrapper: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 10,
  },
  toggleText: {
    marginBottom: 30,
  },
});
