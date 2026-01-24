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
    <header className="sticky top-0 z-30 bg-primary/95 backdrop-blur-md text-header px-4 py-3 shadow-lg flex flex-col sm:flex-row justify-between items-center transition-colors duration-500">
      <div className="flex items-center mb-3 sm:mb-0 w-full sm:w-auto justify-center sm:justify-start">
        <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="mr-2"
        >
            <MapPin size={28} strokeWidth={2.5} />
        </motion.div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Ireland Tourist Map</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors" size={18} />
            <motion.input
              type="text"
              placeholder="Search attractions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full text-sm text-gray-700 bg-white/90 border-none outline-none focus:ring-2 focus:ring-secondary/50 w-full sm:w-64 focus:sm:w-80 transition-all shadow-sm"
            />
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleTheme}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-header transition-colors flex items-center justify-center shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleItinerary}
              className="md:hidden p-2 rounded-full bg-white/20 hover:bg-white/30 text-header transition-colors flex items-center justify-center gap-2 px-4 shadow-sm"
            >
              {isItineraryOpen ? <Map size={20} /> : <List size={20} />}
              <span className="text-sm font-medium">{isItineraryOpen ? 'Map' : 'Itinerary'}</span>
            </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
