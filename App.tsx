import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { searchBooks } from "./src/services/booksApi";

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Explorer</Text>
      <Text>Discover your next favourite book.</Text>
    </View>
  );
}

function SearchScreen() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function handleSearch() {
    setError("");
    try {
      const results = await searchBooks(query);
      setBooks(results);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Search books"
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Search" onPress={handleSearch} />
      {error !== "" && <Text>{error}</Text>}
      <FlatList
        data={books}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Text>
            {item.title} {item.author_name ? `by ${item.author_name[0]}` : ""}
          </Text>
        )}
      />
    </View>
  );
}

function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Library</Text>
      <Text>Your saved books will appear here.</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="My Library" component={LibraryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
