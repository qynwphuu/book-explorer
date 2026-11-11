import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BookRow from "../components/BookRow";
import { searchBooks } from "../services/booksApi";
import { colors } from "../theme";

const CATEGORIES = [
  { label: "All", subject: "" },
  { label: "Fiction", subject: "fiction" },
  { label: "Sci-fi", subject: "science fiction" },
  { label: "Fantasy", subject: "fantasy" },
  { label: "Romance", subject: "romance" },
  { label: "History", subject: "history" },
  { label: "Horror", subject: "horror" },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>("All");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const MIX = ["fiction", "fantasy", "romance", "science fiction"];

async function fetchMixed() {
  const lists = await Promise.all(MIX.map((s) => searchBooks(`subject:"${s}"`)));

  // take one book from each list in turn, so genres alternate
  const mixed: any[] = [];
  for (let i = 0; i < 5; i++) {
    for (const list of lists) {
      if (list[i]) mixed.push(list[i]);
    }
  }
  // drop duplicates
  return mixed.filter((b, i) => mixed.findIndex((x) => x.key === b.key) === i);
}

async function load(q: string) {
  setError("");
  setLoading(true);
  try {
    setBooks(q === "" ? await fetchMixed() : await searchBooks(q));
  } catch (e: any) {
    setError(e.message);
    setBooks([]);
  }
  setLoading(false);
}

useEffect(() => {
  load("");
}, []);

function pickCategory(c: { label: string; subject: string }) {
  setCategory(c.label);
  setQuery("");
  load(c.subject ? `subject:"${c.subject}"` : "");
}

  function handleSearch() {
    if (!query.trim()) return;
    setCategory(null);
    load(query);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.mutedText} />
        <TextInput
          placeholder="Search title, author.."
          placeholderTextColor={colors.mutedText}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          style={styles.input}
        />
      </View>

      <View style={{ height: 44, marginBottom: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity key={c.label} onPress={() => pickCategory(c)}>
              <Text style={[styles.chip, category === c.label && styles.chipActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {error !== "" && <Text style={{ color: colors.text }}>{error}</Text>}
      {loading && <ActivityIndicator size="large" color={colors.accent} />}
      {!loading && error === "" && books.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20, color: colors.text }}>
          No books found. Try a different title or author.
        </Text>
      )}

      <FlatList
        data={books}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <BookRow book={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: colors.background },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  input: { flex: 1, paddingVertical: 12, marginLeft: 8, color: colors.text },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    color: colors.mutedText,
    marginRight: 8,
    overflow: "hidden",
  },
  chipActive: { backgroundColor: colors.accent, color: "#fff" },
});