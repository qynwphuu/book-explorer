import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { searchBooks } from "../services/booksApi";

export default function SearchScreen() {
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