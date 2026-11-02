import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
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
        renderItem={({ item }) => (
          <Text>
            {item.title} {item.author_name ? `by ${item.author_name[0]}` : ""}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
});