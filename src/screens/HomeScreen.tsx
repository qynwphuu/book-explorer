import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getTrendingBooks } from "../services/booksApi";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState("");

  const navigation = useNavigation<any>();

  useEffect(() => {
    getTrendingBooks()
      .then(setBooks)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular this week</Text>
      {error !== "" && <Text>{error}</Text>}
      <FlatList
        data={books}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("BookDetails", { book: item })}
          >
            <Text style={{ paddingVertical: 8 }}>
              {item.title} {item.author_name ? `by ${item.author_name[0]}` : ""}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
});
