import React from "react";
import { Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../app/contextprovider/0ThemeContext";

type ButtonType = "random" | "save";

interface CustomButtonProps {
  type: ButtonType;
  text: string;
  onPress: () => void;
}

export default function CustomButton({
  type,
  text,
  onPress,
}: CustomButtonProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    randomButton: {
      backgroundColor: theme.colors.blue_search,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 20,
    },
    randomButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.white_search,
    },
    saveButton: {
      color: theme.colors.black,
      textAlign: "center",
      borderWidth: 1,
      borderColor: theme.colors.black,
      borderRadius: 12,
      paddingVertical: 14,
      width: "100%",
    },
  });

  if (type === "random") {
    return (
      <TouchableOpacity style={styles.randomButton} onPress={onPress}>
        <Text style={styles.randomButtonText}>{text}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Text
          style={[
            styles.saveButton,
            { fontWeight: pressed ? "bold" : "normal" },
          ]}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
}
