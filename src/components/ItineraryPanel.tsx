import React from 'react';
import { useItinerary } from '../context/ItineraryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Compass, Tent, Share2 } from 'lucide-react';

const ItineraryPanel = () => {
  const { itinerary, removeAttractionFromItinerary } = useItinerary();

  return (
    <aside className="h-full glass-panel border-l border-white/40 p-6 shadow-2xl overflow-y-auto flex flex-col relative z-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-transparent z-10 backdrop-blur-xl -mx-6 px-6 py-4 border-b border-white/20">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm border border-primary/20">
                <Compass size={24} className="animate-spin-slow" />
            </div>
            <div>
                 <h2 className="text-2xl font-extrabold text-text-primary dark:text-white tracking-tight">Your Trip</h2>
                 <p className="text-xs text-muted-text font-bold uppercase tracking-wider">Plan your adventure</p>
            </div>
        </div>
        <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-glow">
            {itinerary.length}
        </span>
      </div>

      {/* Content */}
      {itinerary.length === 0 ? (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex-grow flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-surface/30 border border-white/40 dark:bg-slate-800/30 dark:border-white/10"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-full mb-6 shadow-inner"
            >
                <Tent size={48} className="text-primary opacity-80" />
            </motion.div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Time to Explore!</h3>
            <p className="text-muted-text text-sm leading-relaxed max-w-[220px]">
                Your itinerary is looking a bit empty. Browse the map and add some amazing places to your list.
            </p>
        </motion.div>
      ) : (
        <ul className="space-y-4 pb-24 flex-grow">
            <AnimatePresence mode="popLayout">
            {itinerary.map((attraction, index) => (
                <motion.li
                    key={attraction.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: -50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 50 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-surface/60 dark:bg-slate-800/60 p-4 rounded-2xl shadow-sm border border-white/50 dark:border-white/10 flex justify-between items-center group relative overflow-hidden backdrop-blur-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                >
                    <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-bold text-text-primary dark:text-white truncate text-base group-hover:text-primary transition-colors">
                            {attraction.name}
                        </h4>
                        <span className="text-[10px] font-bold text-muted-text uppercase tracking-wider inline-block mt-1 bg-white/50 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                            {attraction.category}
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.2, rotate: 15, color: '#EF4444' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeAttractionFromItinerary(attraction.id)}
                        className="text-muted-text p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label={`Remove ${attraction.name} from itinerary`}
                    >
                        <Trash2 size={18} />
                    </motion.button>
                </motion.li>
            ))}
            </AnimatePresence>
        </ul>
      )}

      {/* Footer Actions */}
      <AnimatePresence>
      {itinerary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 z-20"
          >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(var(--color-primary), 0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-text-primary text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    <Share2 size={20} />
                    Save & Share Itinerary
                  </span>
              </motion.button>
          </motion.div>
      )}
      </AnimatePresence>
    </aside>
  );
};

export default ItineraryPanel;
