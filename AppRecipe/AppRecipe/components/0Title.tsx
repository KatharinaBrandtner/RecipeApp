import React, { useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "./0ThemeContext";

interface headingProps {
  text: string;
  withMargin?: boolean;
}

export default function Heading({ text, withMargin }: headingProps){
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        h1: {
          marginBottom: withMargin ? 10 : 0,
          ...theme.typography.h1,
          color: theme.colors.black,
        },
      }),
    [theme, withMargin]
  );

  return <Text style={[styles.h1]}>{text}</Text>;
};