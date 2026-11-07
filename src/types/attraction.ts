export interface Attraction {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  photos: string[];
  rating?: number; // e.g., 1-5
  hours?: { // Example, could be more complex
    open: string; // e.g., "09:00"
    close: string; // e.g., "17:00"
  };
  hoursUrl?: string;
  locationSource?: string;
  verifiedOn?: string;
  photoCredit?: {author:string;title:string;source:string;license:string;licenseUrl:string;caption:string};
  category: string; // "Museum", "Castle", "Natural Site", etc.
  averageVisitDuration?: number; // Optional: duration in minutes
  website?: string; // Optional: URL to the official website
}
