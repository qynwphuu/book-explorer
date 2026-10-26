export interface BookItem {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
}

export const MOCK_BOOKS: BookItem[] = [
  {
    id: "1",
    title: "React Native in Action",
    authors: ["Nader Dabit"],
    description: "Build cross-platform mobile apps using React Native.",
    thumbnail: "https://via.placeholder.com/128x192.png?text=React+Native",
  },
  {
    id: "2",
    title: "Clean Code",
    authors: ["Robert C. Martin"],
    description: "A Handbook of Agile Software Craftsmanship.",
    thumbnail: "https://via.placeholder.com/128x192.png?text=Clean+Code",
  },
  {
    id: "3",
    title: "Designing Data-Intensive Applications",
    authors: ["Martin Kleppmann"],
    description:
      "The big ideas behind reliable, scalable, and maintainable systems.",
    thumbnail: "https://via.placeholder.com/128x192.png?text=Data+Apps",
  },
];
