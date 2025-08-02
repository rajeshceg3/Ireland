// Helper function to truncate text at the last word boundary within a maxLength
export function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  // Initial truncation to maxLength to handle cases where text is already shorter
  // or to define the search space for the last word.
  const textToConsider = text.substring(0, maxLength);

  // Find the last space in this potentially pre-truncated string.
  const lastSpaceIndex = textToConsider.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    // If a space is found, truncate to that space.
    return textToConsider.substring(0, lastSpaceIndex);
  } else {
    // If no space is found in the first `maxLength` characters (e.g., one very long word),
    // then we fall back to the hard truncation at maxLength.
    return textToConsider;
  }
}
