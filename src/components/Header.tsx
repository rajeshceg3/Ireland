import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, Map, List, Compass } from 'lucide-react';

interface Props {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isItineraryOpen: boolean;
  onToggleItinerary: () => void;
}

const Header: React.FC<Props> = ({ searchTerm, onSearchChange, theme, onToggleTheme, isItineraryOpen, onToggleItinerary }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-3 py-2 sm:px-5 sm:py-2.5 w-[92%] sm:w-auto max-w-5xl flex flex-row justify-between items-center gap-2 sm:gap-6 shadow-glow transition-all duration-500"
    >
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                className="text-primary bg-primary/10 p-1.5 rounded-full"
            >
                <Compass className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </motion.div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary whitespace-nowrap hidden sm:block"
            >
              Ireland Tourist Map
            </motion.h1>
             <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary whitespace-nowrap sm:hidden"
            >
              Ireland Map
            </motion.h1>
        </div>

      {/* Right Section: Search & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 justify-end flex-grow sm:flex-grow-0">

        {/* Animated Search Bar */}
        <motion.div
          layout
          className={`relative group flex items-center transition-all duration-300 ease-in-out ${isSearchFocused ? 'flex-grow sm:w-64' : 'w-full sm:w-48'}`}
        >
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-primary' : 'text-muted-text'}`} size={16} />
            <motion.input
              layout
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-9 pr-4 py-1.5 sm:py-2 rounded-full text-sm font-medium text-text-primary bg-white/40 dark:bg-slate-800/40 border border-transparent focus:border-primary/50 outline-none focus:ring-2 focus:ring-primary/20 w-full transition-all shadow-inner backdrop-blur-sm"
            />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleTheme}
              className="p-2 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-700 text-text-primary transition-colors flex items-center justify-center shadow-sm border border-transparent hover:border-primary/30"
              aria-label="Toggle Theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {theme === 'light' ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-secondary" />}
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleItinerary}
              className={`p-2 sm:px-4 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-700 text-text-primary transition-colors flex items-center justify-center gap-2 shadow-sm border border-transparent ${isItineraryOpen ? 'text-primary ring-2 ring-primary/20 bg-white' : ''}`}
            >
              {isItineraryOpen ? <Map size={18} /> : <List size={18} />}
              <span className="text-sm font-bold hidden sm:inline">{isItineraryOpen ? 'Map' : 'Plan'}</span>
            </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
