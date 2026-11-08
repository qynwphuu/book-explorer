import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme";

type Props = { book: any; width?: number; onLongPress?: () => void };

export default function BookCard({ book, width = 110, onLongPress }: Props) {
  const navigation = useNavigation<any>();
  const coverStyle = { width, height: width * 1.5 };

  return (
    <TouchableOpacity
      style={{ width, marginBottom: 16 }}
      onPress={() => navigation.navigate("BookDetails", { book })}
      onLongPress={onLongPress}
    >
      {book.cover_i ? (
        <Image
          source={{ uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` }}
          style={[styles.cover, coverStyle]}
        />
      ) : (
        <View style={[styles.cover, styles.noCover, coverStyle]}>
          <Text style={styles.noCoverText}>No cover</Text>
        </View>
      )}
      <Text numberOfLines={1} style={styles.title}>
        {book.title}
      </Text>
      <Text numberOfLines={1} style={styles.author}>
        {book.author_name ? book.author_name[0] : "Unknown author"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cover: { borderRadius: 10, backgroundColor: colors.placeholder },
  noCover: { alignItems: "center", justifyContent: "center" },
  noCoverText: { color: colors.mutedText },
  title: { fontWeight: "bold", marginTop: 8, color: colors.text },
  author: { color: colors.mutedText, marginTop: 2 },
});