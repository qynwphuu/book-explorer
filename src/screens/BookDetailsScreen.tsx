import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
  Linking,
} from "react-native";
import { getBookDescription } from "../services/booksApi";
import { saveBook } from "../database/database";

export default function BookDetailsScreen({ route }: any) {
  const book = route.params.book;
  const [saved, setSaved] = useState(false);
  const [description, setDescription] = useState("");
  const [expanded, setExpanded] = useState(false);

  const showToggle = description.length > 500;

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

      <Button
        title="Read online"
        onPress={() => Linking.openURL(`https://openlibrary.org${book.key}`)}
      />

      <Button
        title={saved ? "Saved!" : "Save to library"}
        onPress={async () => {
          await saveBook(book);
          setSaved(true);
        }}
        disabled={saved}
      />

      <Text numberOfLines={expanded ? undefined : 14} style={{ marginTop: 5 }}>
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
  details: { fontSize: 14, marginBottom: 1, textAlign: "center" },
});
