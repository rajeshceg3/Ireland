import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnToggleTheme = jest.fn();

  it('renders the header with title, search input, and theme toggle button', () => {
    render(
      <Header
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        theme="light"
        onToggleTheme={mockOnToggleTheme}
      />
    );

    // Check for the title
    expect(screen.getByText(/Ireland Tourist Map/i)).toBeInTheDocument();

    // Check for the search input
    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();

    // Check for the theme toggle button
    expect(screen.getByRole('button', { name: /To Dark/i })).toBeInTheDocument();
  });

  it('displays the correct theme toggle button text for dark theme', () => {
    render(
      <Header
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        theme="dark"
        onToggleTheme={mockOnToggleTheme}
      />
    );

    // Check for the theme toggle button text in dark mode
    expect(screen.getByRole('button', { name: /To Light/i })).toBeInTheDocument();
  });
});
