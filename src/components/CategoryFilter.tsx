import React from 'react';
import { motion } from 'framer-motion';
import { ATTRACTION_CATEGORIES, AttractionCategory } from '../config/categories';

interface Props {
  selectedCategory: AttractionCategory;
  onSelectCategory: (category: AttractionCategory) => void;
}

const CategoryFilter: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        aria-label="Attraction Categories"
        className="pointer-events-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 dark:border-white/10 p-1.5 max-w-full overflow-x-auto scrollbar-hide"
      >
        <div className="flex space-x-1 min-w-max">
          {ATTRACTION_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                aria-pressed={isSelected}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected ? 'text-white' : 'text-text-primary hover:text-primary'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-primary rounded-full shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>
      </motion.nav>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;
