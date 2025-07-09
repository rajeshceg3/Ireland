export const ATTRACTION_CATEGORIES = [
  "All", // Special category to show all
  "Natural Site",
  "Museum",
  "Castle",
  "Restaurant",
  "Accommodation"
  // Add more as needed from PRD
] as const; // 'as const' for stricter typing

export type AttractionCategory = typeof ATTRACTION_CATEGORIES[number];
