import React, { useState, useCallback } from "react";
import { Text, FlatList, Alert, StyleSheet, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSavedBooks, removeBook } from "../database/database";
import BookCard from "../components/BookCard";
import { colors } from "../theme";

export default function LibraryScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const { width } = useWindowDimensions();
  const cardWidth = (width - 40 - 24) / 3; // screen minus padding minus 2 gaps

  async function load() {
    setBooks(await getSavedBooks());
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  function confirmRemove(book: any) {
    Alert.alert("Remove book", `Remove "${book.title}" from your library?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeBook(book.key);
          load();
        },
      },
    ]);
  }

  // turn a database row back into the same shape the other screens use
  const toBook = (row: any) => ({
    key: row.key,
    title: row.title,
    author_name: row.author ? row.author.split(", ") : undefined,
    cover_i: row.cover_i,
    first_publish_year: row.year,
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>My Library</Text>
      <Text style={styles.count}>{books.length} BOOKS</Text>
      {books.length === 0 && <Text>No saved books yet.</Text>}
      <FlatList
        data={books}
        keyExtractor={(item) => item.key}
        numColumns={3}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <BookCard
            book={toBook(item)}
            width={cardWidth}
            onLongPress={() => confirmRemove(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: "bold", color: colors.text, marginBottom: 18 },
  count: { color: colors.mutedText, marginTop: 4, marginBottom: 16, fontSize: 12 },
});