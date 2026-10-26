import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { MOCK_BOOKS, BookItem } from "../services/booksApi";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookItem[]>([]);

  const handleSearch = () => {
    if (!query.trim()) return;

    const filtered = MOCK_BOOKS.filter((b) =>
      b.title.toLowerCase().includes(query.toLowerCase()),
    );
    setResults(filtered.length > 0 ? filtered : MOCK_BOOKS);
  };

  return (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search by title or author..."
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardAuthor}>{item.authors.join(", ")}</Text>
            <Text numberOfLines={2} style={styles.cardDesc}>
              {item.description}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  searchRow: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardAuthor: { color: "#666", marginVertical: 4 },
  cardDesc: { color: "#444", fontSize: 13 },
});
