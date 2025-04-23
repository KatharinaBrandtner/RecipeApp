import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image
} from "react-native";
import { useTheme } from "../../components/0ThemeContext";

export default function HomeScreen() {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const backgroundImage = isDarkMode
    ? require("../../assets/images/home-bg-bw.png")
    : require("../../assets/images/home-bg-color.png");

  const styles = useMemo(
    () =>
      StyleSheet.create({
        background: {
          ...theme.background,
        },
        container: {
          ...theme.container,
        },
        h1: {
          marginBottom: 10,
          ...theme.typography.h1,
          color: theme.colors.black,
        },
        toggleText: {
          marginBottom: 30,
          ...theme.typography.link,
          color: theme.colors.back,
        },
        chef:{
           width: 60, 
           height: 90,
           resizeMode: 'contain'
        }
      }),
    [theme],
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      
      <View style={styles.container}>

        <Text style={[styles.h1]}>
          Digital{"\n"}Cook{"\n"}Book
        </Text>

        <TouchableOpacity onPress={toggleDarkMode}>
          <Text style={[styles.toggleText]}>
            Show {isDarkMode ? "color mode" : "black and white"}
            mode
          </Text>
        </TouchableOpacity>

        <Text style={[styles.h1]}>
          Here you can{"\n"}
          find and{"\n"}
          collect the{"\n"}
          best recipes{"\n"}
          for your{"\n"}
          home made{"\n"}
          meals
        </Text>
        <Image
          style={styles.chef}
          source={
            isDarkMode
              ? require('../../assets/images/chef-bw.png') 
              : require('../../assets/images/chef.png')    
          }
        />

      </View>
      
    </ImageBackground>
  );
}
