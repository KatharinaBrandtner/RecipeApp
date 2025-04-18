import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/0ThemeContext';
import { RecipeProvider } from "@/components/0RecipeContext";

export default function TabLayout() {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();

  return (
    <RecipeProvider>  
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDarkMode ? theme.colors.white : theme.colors.blue,
          tabBarInactiveTintColor: theme.colors.grey,
          headerShown: false,

          tabBarStyle: {
            backgroundColor: isDarkMode ? theme.colors.black : theme.colors.white,
            height: 80,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
          }}
        />
        
        <Tabs.Screen
          name="new"
          options={{
            title: 'New Recipe',
            tabBarIcon: ({ color }) => <Ionicons name="add" size={28} color={color} />,
          }}
        />
        
        <Tabs.Screen
          name="my"
          options={{
            title: 'My Recipes',
            tabBarIcon: ({ color }) => <Ionicons name="list" size={28} color={color} />,
          }}
        />
        
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <Ionicons name="search" size={28} color={color} />,
          }}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
          }}
        />
      </Tabs>
    </RecipeProvider>
  );
}
