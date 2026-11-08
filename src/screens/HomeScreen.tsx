import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import BookCard from "../components/BookCard";
import { getTrendingBooks } from "../services/booksApi";

export default function HomeScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrendingBooks()
      .then(setBooks)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular this week</Text>
      {error !== "" && <Text>{error}</Text>}
      <FlatList
        data={books}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginRight: 12 }}>
            <BookCard book={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
});
