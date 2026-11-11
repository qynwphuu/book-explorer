import React, { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookCard from "../components/BookCard";
import { searchBooks } from "../services/booksApi";
import { colors } from "../theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const { width } = useWindowDimensions();
  const cardWidth = (width - 40 - 16) / 2 - 10; // screen minus padding minus gap

  async function handleSearch() {
    if (!query.trim()) return;
    setError("");
    setLoading(true);
    try {
      const results = await searchBooks(query);
      setBooks(results);
      setSearched(true);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: colors.background,
      }}
      edges={["top"]}
    >
      <TextInput
        placeholder="Search books"
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, marginTop: 30 }}
      />

      <Button title="Search" color={colors.accent} onPress={handleSearch} />
      
      {error !== "" && <Text>{error}</Text>}
      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={{ marginTop: 20 }}
        />
      )}
      {!loading && searched && books.length === 0 && error === "" && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No books found. Try a different title or author.
        </Text>
      )}

      <FlatList
        style={{ marginTop: 20 }}
        data={books}
        keyExtractor={(item) => item.key}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-around" }}
        renderItem={({ item }) => <BookCard book={item} width={cardWidth} />}
      />
    </SafeAreaView>
  );
}
