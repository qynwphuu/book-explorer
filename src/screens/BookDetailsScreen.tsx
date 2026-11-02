import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import { getBookDescription } from "../services/booksApi";

export default function BookDetailsScreen({ route }: any) {
  const book = route.params.book;
  const [saved, setSaved] = useState(false);
  const [description, setDescription] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);

  const showToggle = description.length > 400;

  useEffect(() => {
    getBookDescription(book.key)
      .then(setDescription)
      .catch(() => setDescription(""));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {book.cover_i && (
        <Image
          source={{
            uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
          }}
          style={styles.cover}
        />
      )}
      <Text style={styles.title}>{book.title}</Text>

      <Text style={styles.author}>
        {book.author_name ? `by ${book.author_name[0]}` : "Author unknown"}
      </Text>

      <Text style={styles.details}>
        First published in {book.first_publish_year ?? "unknown year"}
      </Text>

      <Text numberOfLines={expanded ? undefined : 6} style={{ marginTop: 5 }}>
        {description || "No description available."}
      </Text>
      {showToggle && (
        <Button
          title={expanded ? "Show less" : "Read more"}
          onPress={() => setExpanded(!expanded)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20 },
  cover: { width: 160, height: 240, marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  author: { fontSize: 16, marginBottom: 8, textAlign: "center" },
  description: { fontSize: 14, marginVertical: 2, textAlign: "center" },
  details: { fontSize: 14, marginBottom: 10, textAlign: "center" },
});
