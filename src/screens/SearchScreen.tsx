import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  useWindowDimensions,
} from "react-native";
import BookCard from "../components/BookCard";
import { searchBooks } from "../services/booksApi";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState("");

  const { width } = useWindowDimensions();
  const cardWidth = (width - 40 - 16) / 2; // screen minus padding minus gap

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
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <BookCard book={item} width={cardWidth} />}
      />
    </View>
  );
}
