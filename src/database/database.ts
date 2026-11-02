import * as SQLite from "expo-sqlite";

async function openDatabase() {
    const db = await SQLite.openDatabaseAsync("books.db");
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS saved_books (
      key TEXT PRIMARY KEY,
      title TEXT,
      author TEXT,
      cover_i INTEGER,
      year INTEGER
    );
  `);
    return db;  
}

export async function saveBook(book: any) {
    const db = await openDatabase();
    await db.runAsync(
        "INSERT OR REPLACE INTO saved_books (key, title, author, cover_i, year) VALUES (?, ?, ?, ?, ?)",
        [
            book.key,
            book.title,
            book.author_name ? book.author_name.join(", ") : null,
            book.cover_i ?? null,
            book.first_publish_year ?? null
        ]
    )
}

export async function getSavedBooks(): Promise<any[]> {
  const db = await openDatabase();
  return db.getAllAsync("SELECT * FROM saved_books");
}

export async function removeBook(key: string) {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM saved_books WHERE key = ?", [key]);
}