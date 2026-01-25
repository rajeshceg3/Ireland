import React from 'react';
import { useItinerary } from '../context/ItineraryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, List } from 'lucide-react';

const ItineraryPanel = () => {
  const { itinerary, removeAttractionFromItinerary } = useItinerary();

  return (
    <aside className="h-full bg-gray-50 dark:bg-gray-800/50 p-4 shadow-inner overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <List className="text-primary" size={24} />
        <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">My Itinerary</h2>
      </div>

      {itinerary.length === 0 ? (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700"
        >
            <p className="text-muted-text dark:text-text-secondary-dark">
                Your itinerary is empty.
                <br /><br />
                Select an attraction on the map to start planning your trip!
            </p>
        </motion.div>
      ) : (
        <ul className="space-y-3 pb-20">
            <AnimatePresence mode="popLayout">
            {itinerary.map((attraction) => (
                <motion.li
                    key={attraction.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 flex justify-between items-center group"
                >
                    <span className="font-medium text-text-primary dark:text-text-primary-dark truncate pr-2">
                        {attraction.name}
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeAttractionFromItinerary(attraction.id)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label={`Remove ${attraction.name} from itinerary`}
                    >
                        <Trash2 size={18} />
                    </motion.button>
                </motion.li>
            ))}
            </AnimatePresence>
        </ul>
      )}
    </aside>
  );
};

export default ItineraryPanel;
