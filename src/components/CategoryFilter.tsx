import React from 'react';
import { ATTRACTION_CATEGORIES, AttractionCategory } from '../config/categories';

interface Props {
  selectedCategory: AttractionCategory;
  onSelectCategory: (category: AttractionCategory) => void;
}

const CategoryFilter: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <nav aria-label="Attraction Categories" className="p-1 sm:p-2 bg-background flex flex-wrap gap-1 sm:gap-2 justify-center"> {/* Reduced gap and padding for xs */}
      {ATTRACTION_CATEGORIES.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          aria-pressed={selectedCategory === category}
          className={`py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm ${selectedCategory === category
              ? 'bg-primary text-white font-semibold'
              : 'bg-card-background text-text-primary hover:bg-secondary hover:text-white'}`}
        >
          {category}
        </button>
      ))}
    </nav>
  );
};

export default CategoryFilter;
