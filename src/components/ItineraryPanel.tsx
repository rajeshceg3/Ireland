import React from 'react';
import { useItinerary } from '../context/ItineraryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Map, Compass } from 'lucide-react';

const ItineraryPanel = () => {
  const { itinerary, removeAttractionFromItinerary } = useItinerary();

  return (
    <aside className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-none overflow-y-auto flex flex-col border-l border-white/20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Compass size={24} />
            </div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-white">Trip Plan</h2>
        </div>
        <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {itinerary.length}
        </span>
      </div>

      {itinerary.length === 0 ? (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-slate-800/50"
        >
            <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-full mb-4">
                <Map size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Your Itinerary is Empty</h3>
            <p className="text-muted-text text-sm max-w-[200px]">
                Explore the map and add attractions to build your dream trip!
            </p>
        </motion.div>
      ) : (
        <ul className="space-y-4 pb-20 flex-grow">
            <AnimatePresence mode="popLayout">
            {itinerary.map((attraction, index) => (
                <motion.li
                    key={attraction.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(var(--color-background), 0.8)' }}
                    className="bg-card-background dark:bg-slate-700 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 flex justify-between items-center group relative overflow-hidden"
                >
                    <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-semibold text-text-primary dark:text-white truncate">
                            {attraction.name}
                        </h4>
                        <span className="text-xs text-muted-text inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-slate-600 rounded mt-1">
                            {attraction.category}
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
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

      {itinerary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
              <button className="w-full py-3 bg-text-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Save Itinerary
              </button>
          </motion.div>
      )}
    </aside>
  );
};

export default ItineraryPanel;
