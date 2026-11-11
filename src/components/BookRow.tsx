import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { saveBook } from "../database/database";
import { colors } from "../theme";

export default function BookRow({ book }: { book: any }) {
  const navigation = useNavigation<any>();
  const [saved, setSaved] = useState(false);
  const tags: string[] = book.subject ? book.subject.slice(0, 2) : [];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("BookDetails", { book })}
    >
      {book.cover_i ? (
        <Image
          source={{ uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` }}
          style={styles.cover}
        />
      ) : (
        <View style={[styles.cover, styles.noCover]}>
          <Text style={{ color: colors.mutedText, fontSize: 11 }}>No cover</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author_name ? book.author_name[0] : "Unknown author"}
        </Text>
        {book.ratings_average ? (
          <Text style={styles.rating}>{book.ratings_average.toFixed(1)} ★</Text>
        ) : null}
        <View style={styles.tags}>
          {tags.map((t) => (
            <Text key={t} style={styles.tag} numberOfLines={1}>
              {t}
            </Text>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.bookmark}
        onPress={async () => {
          await saveBook(book);
          setSaved(true);
        }}
      >
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={22}
          color={colors.accent}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  cover: { width: 80, height: 120, borderRadius: 8, backgroundColor: colors.placeholder },
  noCover: { alignItems: "center", justifyContent: "center" },
  info: { flex: 1, marginLeft: 12, paddingRight: 28 },
  title: { fontSize: 17, fontWeight: "bold", color: colors.text },
  author: { color: colors.mutedText, marginTop: 4 },
  rating: { color: colors.text, marginTop: 6 },
  tags: { flexDirection: "row", gap: 6, marginTop: 10 },
  tag: {
    backgroundColor: colors.background,
    color: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    maxWidth: 110,
    overflow: "hidden",
  },
  bookmark: { position: "absolute", right: 12, top: 12 },
});