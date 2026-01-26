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
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 shadow-glow rounded-3xl sm:rounded-full px-4 py-2 sm:px-6 w-[95%] sm:w-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-3 transition-all duration-500"
    >
      <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="mr-2 sm:mr-3 text-primary"
            >
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
            </motion.div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary whitespace-nowrap"
            >
              Ireland Tourist Map
            </motion.h1>
        </div>
        {/* Mobile toggle moved here for better spacing */}
        <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleItinerary}
              className={`sm:hidden p-2 rounded-full bg-white/50 hover:bg-white text-text-primary transition-colors flex items-center justify-center border border-gray-100 ${isItineraryOpen ? 'text-primary ring-2 ring-primary/20' : ''}`}
        >
              {isItineraryOpen ? <Map size={18} /> : <List size={18} />}
        </motion.button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative w-full sm:w-auto group flex-grow sm:flex-grow-0"
        >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors" size={16} />
            <motion.input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              whileFocus={{ scale: 1.02 }}
              className="pl-9 pr-4 py-1.5 sm:py-2 rounded-full text-sm text-text-primary bg-white/50 border border-gray-200 focus:border-primary/50 outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-48 md:w-64 transition-all shadow-inner backdrop-blur-sm"
            />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-2 sm:gap-3 shrink-0"
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
              className={`hidden sm:flex p-2 rounded-full bg-white/50 hover:bg-white text-text-primary transition-colors items-center justify-center gap-2 px-4 shadow-sm border border-gray-100 ${isItineraryOpen ? 'text-primary ring-2 ring-primary/20' : ''}`}
            >
              {isItineraryOpen ? <Map size={20} /> : <List size={20} />}
              <span className="text-sm font-medium">{isItineraryOpen ? 'Map' : 'Trip Plan'}</span>
            </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
