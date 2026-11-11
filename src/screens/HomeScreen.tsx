import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTrendingBooks } from "../services/booksApi";
import { getSavedBooks } from "../database/database";
import BookCard from "../components/BookCard";
import { colors } from "../theme";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [books, setBooks] = useState<any[]>([]);
  const [reading, setReading] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingBooks()
      .then(setBooks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // reload saved books every time the Home tab is opened
  useFocusEffect(
    useCallback(() => {
      getSavedBooks().then((rows) =>
        setReading(
          rows
            .filter((r) => r.status === "Reading")
            .map((r) => ({
              key: r.key,
              title: r.title,
              author_name: r.author ? r.author.split(", ") : undefined,
              cover_i: r.cover_i,
              first_publish_year: r.year,
            }))
        )
      );
    }, [])
  );

  const featured = books[0];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {error !== "" && <Text>{error}</Text>}
        {loading && <ActivityIndicator size="large" color={colors.accent} />}

        {featured && (
          <TouchableOpacity
            style={styles.banner}
            onPress={() => navigation.navigate("BookDetails", { book: featured })}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.pill}>Popular</Text>
              <Text style={styles.bannerTitle} numberOfLines={3}>
                {featured.title}
              </Text>
              <Text style={styles.bannerAuthor}>
                {featured.author_name ? featured.author_name[0] : "Unknown author"}
                {featured.first_publish_year ? ` (${featured.first_publish_year})` : ""}
              </Text>
              <Text style={styles.readMore}>Read More...</Text>
            </View>
            {featured.cover_i && (
              <Image
                source={{ uri: `https://covers.openlibrary.org/b/id/${featured.cover_i}-M.jpg` }}
                style={styles.bannerCover}
              />
            )}
          </TouchableOpacity>
        )}

        <Text style={styles.heading}>Trending this week</Text>
        <FlatList
          data={books.slice(1)}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ marginRight: 12 }}>
              <BookCard book={item} />
            </View>
          )}
        />

        <Text style={styles.heading}>Continue Reading</Text>
        {reading.length === 0 ? (
          <Text style={styles.empty}>
            Books you mark as "Reading" in My Library will show up here.
          </Text>
        ) : (
          <FlatList
            data={reading}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ marginRight: 12 }}>
                <BookCard book={item} />
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: colors.background },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#faeee3",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    color: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  bannerTitle: { fontSize: 18, fontWeight: "bold", color: colors.text },
  bannerAuthor: { color: colors.mutedText, marginTop: 4 },
  readMore: { color: colors.accent, fontWeight: "bold", marginTop: 8 },
  bannerCover: { width: 90, height: 135, borderRadius: 8 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: colors.text },
  empty: { color: colors.mutedText, marginBottom: 24 },
});