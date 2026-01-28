import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, Map, List, Compass, X } from 'lucide-react';

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
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-2 py-2 sm:px-4 sm:py-2 w-[95%] sm:w-auto max-w-5xl flex flex-row justify-between items-center gap-2 sm:gap-6 shadow-premium transition-all duration-500 hover:shadow-glow/20"
    >
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pl-2">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-primary bg-primary/10 p-2 rounded-full cursor-pointer"
            >
                <Compass className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </motion.div>
            <div className="flex flex-col">
                <motion.h1
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-base sm:text-lg font-extrabold tracking-tight text-text-primary whitespace-nowrap hidden sm:block"
                >
                  Ireland Tourist Map
                </motion.h1>
                 <motion.h1
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-extrabold tracking-tight text-text-primary whitespace-nowrap sm:hidden"
                >
                  Ireland Map
                </motion.h1>
            </div>
        </div>

      {/* Right Section: Search & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 justify-end flex-grow sm:flex-grow-0">

        {/* Animated Search Bar */}
        <motion.div
          layout
          className={`relative group flex items-center transition-all duration-500 ease-out-expo ${isSearchFocused || searchTerm ? 'flex-grow sm:w-72' : 'w-10 sm:w-64'} h-10`}
        >
            <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10 ${isSearchFocused ? 'text-primary' : 'text-muted-text'}`}
                size={16}
            />
            <motion.input
              layout
              type="text"
              placeholder={isSearchFocused ? "Search for attractions..." : "Search..."}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`
                pl-9 pr-8 py-2 rounded-full text-sm font-medium text-text-primary
                bg-surface/50 dark:bg-slate-800/50
                border border-transparent focus:border-primary/30
                outline-none focus:ring-2 focus:ring-primary/20
                w-full h-full transition-all shadow-inner backdrop-blur-md
                placeholder:text-muted-text/70
              `}
            />
             <AnimatePresence>
                {searchTerm && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => onSearchChange('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 text-muted-text transition-colors"
                    >
                        <X size={14} />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0 pr-1">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleTheme}
              className="w-10 h-10 rounded-full bg-surface/50 dark:bg-slate-800/50 hover:bg-surface dark:hover:bg-slate-700 text-text-primary transition-all flex items-center justify-center shadow-sm border border-transparent hover:border-primary/30 backdrop-blur-md group"
              aria-label="Toggle Theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                {theme === 'light' ? <Moon size={18} className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" /> : <Sun size={18} className="text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />}
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleItinerary}
              className={`
                h-10 px-3 sm:px-5 rounded-full
                bg-surface/50 dark:bg-slate-800/50
                hover:bg-surface dark:hover:bg-slate-700
                text-text-primary transition-all flex items-center justify-center gap-2
                shadow-sm border border-transparent backdrop-blur-md
                ${isItineraryOpen ? 'text-primary ring-2 ring-primary/20 bg-surface' : ''}
              `}
            >
              {isItineraryOpen ? <Map size={18} /> : <List size={18} />}
              <span className="text-sm font-bold hidden sm:inline">{isItineraryOpen ? 'Map' : 'Plan Trip'}</span>
            </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
