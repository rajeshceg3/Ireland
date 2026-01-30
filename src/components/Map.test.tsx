import React from 'react';
import { render, screen } from '@testing-library/react';
import MapComponent from './Map';
import { Attraction } from '../types/attraction';

// Mock react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: () => <div data-testid="marker" />,
  Popup: () => <div data-testid="popup" />,
  useMap: () => ({ fitBounds: jest.fn() }),
}));

// Mock icons to avoid webpack issues in tests
jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      mergeOptions: jest.fn(),
      prototype: { _getIconUrl: jest.fn() }
    }
  }
}));

// Mock AttractionMarker
jest.mock('./AttractionMarker', () => () => <div data-testid="attraction-marker" />);

// Mock MapUpdater
jest.mock('./MapUpdater', () => () => <div data-testid="map-updater" />);

describe('MapComponent', () => {
  const mockAttractions: Attraction[] = [
    {
      id: '1',
      name: 'Test Attraction',
      description: 'Test Description',
      category: 'Historical Sites',
      location: { lat: 53, lng: -7 },
      rating: 4.5,
      hours: { open: '09:00', close: '17:00' },
      website: 'https://example.com',
      photos: []
    }
  ];

  it('renders map and markers when attractions exist', () => {
    render(
      <MapComponent
        attractions={mockAttractions}
        onMarkerClick={jest.fn()}
        activeCategoryFilter="All"
        searchTerm=""
      />
    );

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('attraction-marker')).toBeInTheDocument();
    expect(screen.queryByText(/No attractions found/i)).not.toBeInTheDocument();
  });

  it('renders map and "No attractions found" message when no attractions match', () => {
    render(
      <MapComponent
        attractions={mockAttractions}
        onMarkerClick={jest.fn()}
        activeCategoryFilter="Natural Site" // Filter that doesn't match "Historical Sites"
        searchTerm=""
      />
    );

    // The bug fix ensures map container is STILL there
    expect(screen.getByTestId('map-container')).toBeInTheDocument();

    // And the message IS there
    expect(screen.getByText(/No attractions found/i)).toBeInTheDocument();
  });
});
