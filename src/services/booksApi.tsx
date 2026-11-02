export async function searchBooks(query: string) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
  );

  if (response.status === 429) {
    throw new Error("Too many searches. Please wait a bit and try again.");
  }
  if (response.status >= 500) {
    throw new Error("Open Library is down right now. Try again in a few minutes.");
  }
  if (!response.ok) {
    throw new Error("Something went wrong. Try again.");
  }

  const data = await response.json();
  return data.docs ?? [];
}

export async function getTrendingBooks() {
  const response = await fetch("https://openlibrary.org/trending/weekly.json?limit=10");
  if (!response.ok) {
    throw new Error("Could not load popular books.");
  }
  const data = await response.json();
  return data.works ?? [];
}