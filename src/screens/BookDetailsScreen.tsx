import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, ScrollView, Linking, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getBookDescription } from "../services/booksApi";
import { saveBook } from "../database/database";
import { colors } from "../theme";

const LANGUAGES: Record<string, string> = {
  eng: "English",
  fre: "French",
  ger: "German",
  spa: "Spanish",
  ita: "Italian",
  rus: "Russian",
  jpn: "Japanese",
  chi: "Chinese",
  por: "Portuguese",
  dut: "Dutch",
  swe: "Swedish",
  fin: "Finnish",
};

function languageName(book: any) {
  const codes: string[] = book.language ?? [];
  if (codes.length === 0) return "-";
  const code = codes.includes("eng") ? "eng" : codes[0];
  return LANGUAGES[code] ?? code.toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={rating >= i ? "star" : rating >= i - 0.5 ? "star-half" : "star-outline"}
          size={16}
          color="#f5a623"
        />
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function BookDetailsScreen({ route }: any) {
  const book = route.params.book;
  const [saved, setSaved] = useState(false);
  const [description, setDescription] = useState("");
  const [expanded, setExpanded] = useState(false);

  const showToggle = description.length > 400;
  const category: string | undefined = book.subject?.[0];

  useEffect(() => {
    getBookDescription(book.key)
      .then(setDescription)
      .catch(() => setDescription(""));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {book.cover_i && (
        <Image
          source={{ uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` }}
          style={styles.cover}
        />
      )}

      {category && (
        <Text style={styles.pill} numberOfLines={1}>
          {category}
        </Text>
      )}

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>
        {book.author_name ? `By ${book.author_name[0]}` : "Author unknown"}
      </Text>

      {book.ratings_average ? <Stars rating={book.ratings_average} /> : null}

      <View style={styles.statsRow}>
        <Stat label="Pages" value={book.number_of_pages_median?.toString() ?? "-"} />
        <Stat label="Language" value={languageName(book)} />
        <Stat label="Year" value={book.first_publish_year?.toString() ?? "-"} />
      </View>

      <Text style={styles.heading}>Description</Text>
      <Text numberOfLines={expanded ? undefined : 6} style={styles.description}>
        {description || "No description available."}
      </Text>
      {showToggle && (
        <Button
          title={expanded ? "Show less" : "Read more"}
          onPress={() => setExpanded(!expanded)}
        />
      )}

      <View style={styles.buttons}>
        <Button
          title={saved ? "Saved!" : "Save to library"}
          color={colors.accent}
          disabled={saved}
          onPress={async () => {
            await saveBook(book);
            setSaved(true);
          }}
        />
        <Button
          title="Read online"
          color={colors.accent}
          onPress={() => Linking.openURL(`https://openlibrary.org${book.key}`)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20, backgroundColor: colors.card },
  cover: { width: 200, height: 300, borderRadius: 10, marginBottom: 16 },
  pill: {
    borderWidth: 1,
    borderColor: colors.accent,
    color: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: 220,
    overflow: "hidden",
  },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: colors.text },
  author: { fontSize: 16, color: colors.mutedText, marginVertical: 6 },
  stars: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 4 },
  ratingText: { marginLeft: 6, color: colors.text },
  statsRow: { flexDirection: "row", gap: 10, marginVertical: 16, alignSelf: "stretch" },
  stat: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 12,
  },
  statLabel: { color: colors.mutedText, marginBottom: 4, fontSize: 12 },
  statValue: { fontSize: 16, fontWeight: "bold", color: colors.text },
  heading: { alignSelf: "flex-start", fontSize: 20, fontWeight: "bold", marginBottom: 8, color: colors.text },
  description: { alignSelf: "stretch", lineHeight: 22, color: colors.text },
  buttons: { alignSelf: "stretch", marginTop: 16, gap: 8 },
});