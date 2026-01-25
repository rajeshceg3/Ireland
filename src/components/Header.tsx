import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sun, Moon, Map, List, MapPin } from 'lucide-react';

interface Props {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isItineraryOpen: boolean;
  onToggleItinerary: () => void;
}

const Header: React.FC<Props> = ({ searchTerm, onSearchChange, theme, onToggleTheme, isItineraryOpen, onToggleItinerary }) => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-30 bg-background/70 backdrop-blur-lg border-b border-white/20 px-4 py-3 shadow-sm flex flex-col sm:flex-row justify-between items-center transition-all duration-500"
    >
      <div className="flex items-center mb-3 sm:mb-0 w-full sm:w-auto justify-center sm:justify-start">
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="mr-3 text-primary"
        >
            <MapPin size={32} strokeWidth={2.5} />
        </motion.div>
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        >
          Ireland Tourist Map
        </motion.h1>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative w-full sm:w-auto group"
        >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors" size={18} />
            <motion.input
              type="text"
              placeholder="Search attractions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              whileFocus={{ width: 300, scale: 1.02 }}
              className="pl-10 pr-4 py-2 rounded-full text-sm text-text-primary bg-white/50 border border-gray-200 focus:border-primary/50 outline-none focus:ring-4 focus:ring-primary/10 w-full sm:w-64 transition-all shadow-sm backdrop-blur-sm"
            />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 w-full sm:w-auto justify-center"
        >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleTheme}
              className="p-2.5 rounded-full bg-white/50 hover:bg-white text-text-primary transition-colors flex items-center justify-center shadow-sm border border-gray-100 hover:border-primary/30"
              aria-label="Toggle Theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {theme === 'light' ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-secondary" />}
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleItinerary}
              className={`md:hidden p-2 rounded-full bg-white/50 hover:bg-white text-text-primary transition-colors flex items-center justify-center gap-2 px-4 shadow-sm border border-gray-100 ${isItineraryOpen ? 'text-primary ring-2 ring-primary/20' : ''}`}
            >
              {isItineraryOpen ? <Map size={20} /> : <List size={20} />}
              <span className="text-sm font-medium">{isItineraryOpen ? 'Map' : 'Itinerary'}</span>
            </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
