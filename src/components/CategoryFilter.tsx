import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  TreePine,
  Landmark,
  Utensils,
  BedDouble,
  Castle,
  Globe
} from 'lucide-react';
import { ATTRACTION_CATEGORIES, AttractionCategory } from '../config/categories';

interface Props {
  selectedCategory: AttractionCategory;
  onSelectCategory: (category: AttractionCategory) => void;
}

const getCategoryIcon = (category: AttractionCategory) => {
  switch (category) {
    case 'All': return <LayoutGrid size={16} />;
    case 'Natural Site': return <TreePine size={16} />;
    case 'Museum': return <Landmark size={16} />;
    case 'Castle': return <Castle size={16} />;
    case 'Restaurant': return <Utensils size={16} />;
    case 'Accommodation': return <BedDouble size={16} />;
    default: return <Globe size={16} />;
  }
};

const CategoryFilter: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="absolute top-20 sm:top-24 left-0 right-0 z-20 flex justify-center pointer-events-none px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        aria-label="Attraction Categories"
        className="pointer-events-auto glass rounded-full p-1.5 max-w-full overflow-x-auto scrollbar-hide shadow-lg"
      >
        <div className="flex space-x-1 min-w-max">
          {ATTRACTION_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                aria-pressed={isSelected}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary
                  ${isSelected ? 'text-white shadow-md' : 'text-text-primary hover:text-primary hover:bg-white/40'}
                `}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-primary rounded-full shadow-inner"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category}
                </span>
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
