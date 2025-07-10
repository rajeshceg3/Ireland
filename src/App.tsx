import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MapComponent from './components/Map';
import CategoryFilter from './components/CategoryFilter';
import AttractionDetailCard from './components/AttractionDetailCard';
import JsonLdInjector from './components/JsonLdInjector';
import { Attraction } from './types/attraction';
import { AttractionCategory, ATTRACTION_CATEGORIES } from './config/categories';

// Helper function to truncate text at the last word boundary within a maxLength
function truncateAtWordBoundary(text: string, maxLength: number): string {
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

type Theme = 'light' | 'dark';

function App() {
  // --- State Variables ---
  // Data fetching states for attractions
  const [allAttractionsData, setAllAttractionsData] = useState<Attraction[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true); // True while fetching, false otherwise
  const [apiError, setApiError] = useState<string | null>(null); // Holds error messages from API calls

  // UI interaction states
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null); // Attraction displayed in the detail modal
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<AttractionCategory>(ATTRACTION_CATEGORIES[0]); // Current category filter, defaults to "All"
  const [searchTerm, setSearchTerm] = useState<string>(""); // Current search term input by user

  // Theming state
  const [theme, setTheme] = useState<Theme>('light'); // Current theme ('light' or 'dark')

  // SEO state for dynamic JSON-LD
  const [touristAttractionLd, setTouristAttractionLd] = useState<object | null>(null); // JSON-LD data for the selected attraction

  // Ref to store the UI element that triggered the modal, for returning focus upon modal close
  const triggeringElementRef = useRef<HTMLElement | null>(null);

  // --- Effects ---
  // Effect to fetch initial attraction data from the API on component mount
  useEffect(() => {
    const fetchAttractions = async () => {
      setIsLoadingApi(true);
      setApiError(null);
      try {
        const response = await fetch('/api/attractions.json'); // Fetches from public/api/
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Attraction[] = await response.json();
        setAllAttractionsData(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setApiError(errorMessage);
        console.error("Failed to fetch attractions:", error); // Log error for debugging
      } finally {
        setIsLoadingApi(false); // Ensure loading is set to false after fetch attempt
      }
    };
    fetchAttractions();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Effect to handle theme changes by applying/removing the 'dark' class to the HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]); // Runs whenever the theme state changes

  // Effect for dynamic document titles based on the selected attraction
  useEffect(() => {
    const baseTitle = "Ireland Tourist Map - Discover Attractions & Plan Your Trip";
    if (selectedAttraction) {
      document.title = `${selectedAttraction.name} | Ireland Tourist Map`;
    } else {
      document.title = baseTitle;
    }
  }, [selectedAttraction]); // Runs when selectedAttraction changes

  // Effect to prepare TouristAttraction JSON-LD for the currently selected attraction
  useEffect(() => {
    if (selectedAttraction) {
      // Construct the schema object based on the selected attraction's data
      const schema: any = {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": selectedAttraction.name,
        "description": truncateAtWordBoundary(selectedAttraction.description, 250),
        "image": selectedAttraction.photos && selectedAttraction.photos.length > 0 ? selectedAttraction.photos[0] : undefined,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": selectedAttraction.location.lat.toString(),
          "longitude": selectedAttraction.location.lng.toString()
        },
        // Example: "url": `https://www.your-live-url.com/attractions/${selectedAttraction.id}` // If individual pages existed
      };
      // Clean up undefined properties from the schema
      Object.keys(schema).forEach(key => { if (schema[key] === undefined) delete schema[key]; });
      if (schema.geo && (schema.geo.latitude === undefined || schema.geo.longitude === undefined)) delete schema.geo;

      setTouristAttractionLd(schema);
    } else {
      setTouristAttractionLd(null); // Clear JSON-LD data when no attraction is selected
    }
  }, [selectedAttraction]); // Runs when selectedAttraction changes

  // --- Event Handlers ---
  // Toggles the theme between 'light' and 'dark'
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  // Opens the attraction detail modal and stores the triggering element for focus return
  const handleOpenDetailCard = (attraction: Attraction) => {
    triggeringElementRef.current = document.activeElement as HTMLElement;
    setSelectedAttraction(attraction);
  };

  // Closes the attraction detail modal
  const handleCloseDetailCard = () => {
    setSelectedAttraction(null);
    // Focus return is now handled by AttractionDetailCard itself using triggeringElementRef
  };

  // Handles selection of a new category filter
  const handleCategorySelect = (category: AttractionCategory) => {
    setActiveCategoryFilter(category);
    setSearchTerm(""); // Reset search term when category changes for better UX
  };

  // Updates the search term state as the user types
  const handleSearchChange = (term: string) => setSearchTerm(term);

  // --- Render Logic ---
  // Display loading message while API data is being fetched
  if (isLoadingApi) {
    return <div className="flex justify-center items-center h-screen bg-background text-text-primary">Loading attractions...</div>;
  }
  // Display error message if API call failed
  if (apiError) {
    return <div className="flex justify-center items-center h-screen bg-background text-red-500">Error: {apiError}</div>;
  }

  // Main application UI
  return (
    <>
      <JsonLdInjector jsonData={touristAttractionLd} scriptId="touristAttractionLdScript" />
      <div className="flex flex-col h-screen bg-background">
        <Header
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <CategoryFilter
          selectedCategory={activeCategoryFilter}
          onSelectCategory={handleCategorySelect}
        />
        <main className="flex-grow">
          <MapComponent
            attractions={allAttractionsData}
            onMarkerClick={handleOpenDetailCard}
            activeCategoryFilter={activeCategoryFilter}
            searchTerm={searchTerm}
          />
        </main>
        <AttractionDetailCard
          attraction={selectedAttraction}
          onClose={handleCloseDetailCard}
          triggeringElementRef={triggeringElementRef}
        />
      </div>
    </>
  );
}
export default App;
