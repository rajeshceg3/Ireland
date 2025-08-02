import React from 'react';

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
    <header className="bg-primary text-header p-2 sm:p-4 shadow-md flex flex-col sm:flex-row justify-between items-center">
      <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-0">Ireland Tourist Map</h1>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-3 py-1.5 rounded-md text-sm text-text-primary focus:ring-2 focus:ring-secondary focus:border-transparent w-full sm:w-auto"
        />
        <button
          onClick={onToggleTheme}
          className="p-2 rounded bg-secondary hover:bg-opacity-80 text-xs text-white w-full sm:w-auto whitespace-nowrap"
        >
          {theme === 'light' ? 'To Dark' : 'To Light'}
        </button>
        <button
          onClick={onToggleItinerary}
          className="md:hidden p-2 rounded bg-secondary hover:bg-opacity-80 text-xs text-white w-full sm:w-auto whitespace-nowrap"
        >
          {isItineraryOpen ? 'Close Itinerary' : 'View Itinerary'}
        </button>
      </div>
    </header>
  );
};

export default Header;
