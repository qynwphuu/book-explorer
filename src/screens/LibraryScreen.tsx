import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSavedBooks, removeBook, updateStatus } from "../database/database";
import BookCard from "../components/BookCard";
import { colors } from "../theme";

const STATUSES = ["To read", "Reading", "Finished"];
const FILTERS = ["All", ...STATUSES];

export default function LibraryScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"title" | "year">("title");
  const { width } = useWindowDimensions();
  const cardWidth = (width - 40 - 24) / 3;

  async function load() {
    setBooks(await getSavedBooks());
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  function openMenu(book: any) {
    Alert.alert(book.title, "What do you want to do?", [
      ...STATUSES.map((s) => ({
        text: `Mark as ${s}`,
        onPress: async () => {
          await updateStatus(book.key, s);
          load();
        },
      })),
      {
        text: "Remove from library",
        style: "destructive" as const,
        onPress: async () => {
          await removeBook(book.key);
          load();
        },
      },
      { text: "Cancel", style: "cancel" as const },
    ]);
  }

  const toBook = (row: any) => ({
    key: row.key,
    title: row.title,
    author_name: row.author ? row.author.split(", ") : undefined,
    cover_i: row.cover_i,
    first_publish_year: row.year,
  });

  const shown = books
    .filter((b) => filter === "All" || b.status === filter)
    .sort((a, b) =>
      sortBy === "title"
        ? a.title.localeCompare(b.title)
        : (b.year ?? 0) - (a.year ?? 0)
    );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>My Library</Text>
      <Text style={styles.count}>{shown.length} BOOKS</Text>

      <View style={styles.row}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}>
            <Text style={[styles.chip, filter === f && styles.chipActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={() => setSortBy(sortBy === "title" ? "year" : "title")}>
        <Text style={styles.sort}>Sort by: {sortBy === "title" ? "Title (A-Z)" : "Year (newest)"}</Text>
      </TouchableOpacity>

      {shown.length === 0 && <Text>No books here yet.</Text>}
      <FlatList
        data={shown}
        keyExtractor={(item) => item.key}
        numColumns={3}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View>
            <BookCard
              book={toBook(item)}
              width={cardWidth}
              onLongPress={() => openMenu(item)}
            />
            <Text style={styles.status}>{item.status ?? "To read"}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: "bold", color: colors.text },
  count: { color: colors.mutedText, marginTop: 4, marginBottom: 12, fontSize: 12 },
  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.card,
    color: colors.text,
    overflow: "hidden",
  },
  chipActive: { backgroundColor: colors.accent, color: "#fff" },
  sort: { color: colors.accent, marginBottom: 12 },
  status: { color: colors.accent, fontSize: 12, marginTop: -10, marginBottom: 12 },
});