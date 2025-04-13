import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet
} from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useRouter } from 'expo-router';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
}

const SearchRecipes = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        searchMeals(query);
      } else {
        setResults([]);
      }
    }, 600); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchMeals = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await res.json();
      setResults(data.meals || []);
    } catch (error) {
      console.error('Fehler bei der API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Meal }) => (
    <TouchableOpacity onPress={() => router.push(`/search/${item.idMeal}`)}>
      <View style={styles.card}>
        <Image source={{ uri: item.strMealThumb }} style={styles.image} />
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.black }]}>{item.strMeal}</Text>
          <Text
            numberOfLines={2}
            style={[styles.description, { color: theme.colors.grey }]}>
            {item.strInstructions}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.white }]}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Suche ein Rezept..."
        placeholderTextColor={theme.colors.grey}
        style={[styles.input, {
          color: theme.colors.black,
          borderColor: theme.colors.grey
        }]}
      />

{isLoading ? (
  <Text style={{ color: theme.colors.grey, marginTop: 20 }}>Suche läuft...</Text>
) : results.length === 0 && query.trim().length > 1 ? (
  <Text style={{ color: theme.colors.grey, marginTop: 20 }}>Keine Ergebnisse gefunden.</Text>
) : (
  <FlatList
    data={results}
    keyExtractor={(item) => item.idMeal}
    renderItem={renderItem}
    contentContainerStyle={{ paddingBottom: 100 }}
  />
)}

    </View>
  );
};

export default SearchRecipes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    marginTop: 4,
  },
});
