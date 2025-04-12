import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeContext';

const iconMap = {
  home: 'home',
  new: 'add',
  my: 'list',
  search: 'search',
} as const;

type TabRouteName = keyof typeof iconMap; // 'home' | 'new' | 'my' | 'search'

export default function TabsLayout() {
    const { theme, isDarkMode } = useTheme();
  
    console.log('Theme:', theme);  // Füge Debugging hinzu
    console.log('Is Dark Mode:', isDarkMode);
  
    if (!theme || !isDarkMode) {
      return <Text>Loading theme...</Text>;
    }
  
    return (
      <Tabs
        initialRouteName="home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const routeName = route.name as TabRouteName;
            const iconName = iconMap[routeName];
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.blue,
          tabBarInactiveTintColor: theme.colors.grey,
          tabBarStyle: {
            backgroundColor: isDarkMode ? theme.colors.black : theme.colors.white,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            paddingBottom: 15,
          },
          headerShown: false,
        })}
      >
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="new" options={{ title: 'New Recipe' }} />
        <Tabs.Screen name="my" options={{ title: 'My Recipes' }} />
        <Tabs.Screen name="search" options={{ title: 'Search' }} />
      </Tabs>
    );
  }