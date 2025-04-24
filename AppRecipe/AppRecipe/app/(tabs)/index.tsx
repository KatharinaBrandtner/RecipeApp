import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "../contextprovider/0ThemeContext";
import Heading from "../../components/0Title";

export default function HomeScreen() {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const backgroundImage = isDarkMode
    ? require("../../assets/images/home-bg-bw.png")
    : require("../../assets/images/home-bg-color.png");

    // style nur neu gerändert wenn sich theme ändert (performance besser, Hook)
  const styles = useMemo(
    () =>
      StyleSheet.create({
        background: {
          ...theme.background,
        },
        container: {
          ...theme.container,
        },
        toggleText: {
          marginBottom: 30,
          ...theme.typography.link,
          color: theme.colors.back,
        },
        chef: {
          width: 60,
          height: 90,
          resizeMode: "contain",
        },
      }),
    [theme]
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Heading withMargin={false} text="Digital" />
        <Heading withMargin={false} text="Cook" />
        <Heading withMargin={true} text="Book" />

        <TouchableOpacity onPress={toggleDarkMode}>
          <Text style={[styles.toggleText]}>
            Show {isDarkMode ? "color " : "black and white "}
            mode
          </Text>
        </TouchableOpacity>

        <Heading withMargin={false} text="Here you can" />
        <Heading withMargin={false} text="find and" />
        <Heading withMargin={false} text="collect the" />
        <Heading withMargin={false} text="best recipes" />
        <Heading withMargin={false} text="for your" />
        <Heading withMargin={false} text="home made" />
        <Heading withMargin={true} text="meals" />

        <Image
          style={styles.chef}
          source={
            isDarkMode
              ? require("../../assets/images/chef-bw.png")
              : require("../../assets/images/chef.png")
          }
        />
      </View>
    </ImageBackground>
  );
}
