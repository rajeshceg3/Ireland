import { Attraction } from '../types/attraction';

const ATTRACTIONS_API_ENDPOINT = '/api/attractions.json';

/**
 * Fetches all tourist attractions from the data source.
 * @returns A promise that resolves to an array of Attraction objects.
 * @throws An error if the network response is not ok.
 */
let attractionsCache: Promise<Attraction[]> | null = null;

export const fetchAllAttractions = (): Promise<Attraction[]> => {
  if (attractionsCache) {
    return attractionsCache;
  }

  attractionsCache = (async () => {
    try {
      const response = await fetch(ATTRACTIONS_API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Attraction[] = await response.json();

      // Deduplicate attractions based on coordinates to prevent stacking markers
      const seenCoordinates = new Set<string>();
      const uniqueAttractions = data.filter(attraction => {
        const coordKey = `${attraction.location.lat},${attraction.location.lng}`;
        if (seenCoordinates.has(coordKey)) {
          console.warn(`Duplicate attraction location detected and removed: ${attraction.name} (${coordKey})`);
          return false;
        }
        seenCoordinates.add(coordKey);
        return true;
      });

      return uniqueAttractions;
    } catch (error) {
      attractionsCache = null; // Reset cache on error so retries work
      throw error;
    }
  })();

  return attractionsCache;
};

/**
 * Fetches a single attraction by its ID.
 * Note: This is a mock implementation. In a real application, this would
 * likely be a separate API endpoint (e.g., /api/attractions/:id).
 * @param id The ID of the attraction to fetch.
 * @returns A promise that resolves to the Attraction object or null if not found.
 */
export const fetchAttractionById = async (id: string): Promise<Attraction | null> => {
  const attractions = await fetchAllAttractions();
  return attractions.find(attraction => attraction.id === id) || null;
};
