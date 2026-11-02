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
  const response = await fetch("https://openlibrary.org/trending/weekly.json?limit=15");
  if (!response.ok) {
    throw new Error("Could not load popular books.");
  }
  const data = await response.json();
  return data.works ?? [];
}

export async function getBookDescription(key: string) {
  const response = await fetch(`https://openlibrary.org${key}.json?limit=1`);
  if (!response.ok) {
    throw new Error("Could not load the description.");
  }
  const data = await response.json();

  console.log("DESCRIPTION RAW:", data.description); // to check what comes back

  // Open Library returns either a plain string or an object like { value: "..." }
  if (typeof data.description === "string") return data.description;
  if (data.description?.value) return data.description.value;
  return "";
}