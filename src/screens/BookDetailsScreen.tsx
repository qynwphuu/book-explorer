import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, ScrollView, Linking, StyleSheet } from "react-native";
import { getBookDescription } from "../services/booksApi";
import { saveBook } from "../database/database";
import { colors } from "../theme";

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
  const subjects: string[] = book.subject ? book.subject.slice(0, 5) : [];

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
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>
        {book.author_name ? `by ${book.author_name[0]}` : "Author unknown"}
      </Text>

      <View style={styles.statsRow}>
        <Stat label="Pages" value={book.number_of_pages_median?.toString() ?? "-"} />
        <Stat label="Rating" value={book.ratings_average ? book.ratings_average.toFixed(1) : "-"} />
        <Stat label="Year" value={book.first_publish_year?.toString() ?? "-"} />
      </View>

      <Text style={styles.heading}>Description</Text>
      {subjects.length > 0 && (
        <View style={styles.chips}>
          {subjects.map((s) => (
            <Text key={s} style={styles.chip}>
              {s}
            </Text>
          ))}
        </View>
      )}
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
  cover: { width: 130, height: 195, borderRadius: 10, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: colors.text },
  author: { fontSize: 16, color: colors.mutedText, marginVertical: 8 },
  statsRow: { flexDirection: "row", marginVertical: 16, alignSelf: "stretch" },
  stat: { flex: 1, alignItems: "center" },
  statLabel: { color: colors.mutedText, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "bold", color: colors.text },
  heading: { alignSelf: "flex-start", fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", alignSelf: "flex-start", gap: 8, marginBottom: 8 },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  description: { alignSelf: "stretch", lineHeight: 22, marginTop: 4 },
  buttons: { alignSelf: "stretch", marginTop: 16, gap: 8 },
});