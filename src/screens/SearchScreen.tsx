import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import { searchBooks } from "../services/booksApi";
import { useNavigation } from "@react-navigation/native";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState("");

  const navigation = useNavigation<any>();

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
          <TouchableOpacity
            onPress={() => navigation.navigate("BookDetails", { book: item })}
          >
            <Text style={{ paddingVertical: 8 }}>
              {item.title} {item.author_name ? `by ${item.author_name[0]}` : ""}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
