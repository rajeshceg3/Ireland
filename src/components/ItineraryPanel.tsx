import React from 'react';
import { useItinerary } from '../context/ItineraryContext';

const ItineraryPanel = () => {
  const { itinerary, removeAttractionFromItinerary } = useItinerary();

  if (itinerary.length === 0) {
    return (
      <aside className="w-80 bg-gray-100 dark:bg-gray-800 p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-text-primary dark:text-text-primary-dark">My Itinerary</h2>
        <p className="text-text-secondary dark:text-text-secondary-dark">Your itinerary is empty. Click on an attraction's marker on the map and add it to your plan.</p>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-gray-100 dark:bg-gray-800 p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-text-primary dark:text-text-primary-dark">My Itinerary</h2>
      <ul className="space-y-2">
        {itinerary.map(attraction => (
          <li key={attraction.id} className="flex justify-between items-center bg-white dark:bg-gray-700 p-2 rounded-lg">
            <span className="text-text-primary dark:text-text-primary-dark">{attraction.name}</span>
            <button
              onClick={() => removeAttractionFromItinerary(attraction.id)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
              aria-label={`Remove ${attraction.name} from itinerary`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ItineraryPanel;
