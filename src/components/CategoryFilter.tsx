import React from 'react';
import { motion } from 'framer-motion';
import { ATTRACTION_CATEGORIES, AttractionCategory } from '../config/categories';

interface Props {
  selectedCategory: AttractionCategory;
  onSelectCategory: (category: AttractionCategory) => void;
}

const CategoryFilter: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <nav aria-label="Attraction Categories" className="w-full bg-background/80 backdrop-blur-sm z-20 border-b border-black/5 dark:border-white/10 shadow-sm py-2">
      <div className="max-w-full overflow-x-auto px-4 pb-1 scrollbar-hide">
        <motion.div
            className="flex space-x-2 min-w-max px-2"
            layout
        >
          {ATTRACTION_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <motion.button
                key={category}
                onClick={() => onSelectCategory(category)}
                aria-pressed={isSelected}
                layout
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors border shadow-sm ${
                    isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-card-background text-text-primary border-black/5 hover:border-primary/50'
                }`}
              >
                {category}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default CategoryFilter;
