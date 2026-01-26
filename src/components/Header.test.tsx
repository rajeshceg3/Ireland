import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnToggleTheme = jest.fn();
  const mockOnToggleItinerary = jest.fn();

  it('renders the header with title, search input, and theme toggle button', () => {
    render(
      <Header
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        theme="light"
        onToggleTheme={mockOnToggleTheme}
        isItineraryOpen={false}
        onToggleItinerary={mockOnToggleItinerary}
      />
    );

    // Check for the title
    expect(screen.getByText(/Ireland Tourist Map/i)).toBeInTheDocument();

    // Check for the search input
    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();

    // Check for the theme toggle button
    expect(screen.getByLabelText(/Toggle Theme/i)).toBeInTheDocument();
  });
});
