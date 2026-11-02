import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getBookDescription } from "../services/booksApi";

export default function BookDetailsScreen({ route }: any) {
  const book = route.params.book;
  const [saved, setSaved] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    getBookDescription(book.key)
      .then(setDescription)
      .catch(() => setDescription(""));
  }, []);

  return (
    <View style={styles.container}>
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
      <Text style={{ marginVertical: 12 }}>
        {description || "No description available."}
      </Text>
      <Text style={styles.details}>
        First published in {book.first_publish_year ?? "unknown year"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  cover: { width: 160, height: 240, marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  author: { fontSize: 16, marginBottom: 8, textAlign: "center" },
  description: { fontSize: 14, marginBottom: 8, textAlign: "center" },
  details: { fontSize: 14, textAlign: "center" },
});
