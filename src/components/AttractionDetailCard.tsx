import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Attraction } from '../types/attraction';
import { useItinerary } from '../context/ItineraryContext';

interface Props {
  attraction: Attraction | null;
  onClose: () => void;
  triggeringElementRef?: React.RefObject<HTMLElement | null>; // Ref to the element that opened the modal
}

const AttractionDetailCard: React.FC<Props> = ({ attraction, onClose, triggeringElementRef }) => {
  const { addAttractionToItinerary, isAttractionInItinerary } = useItinerary();
  const [imageError, setImageError] = useState(false);
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null); // Ref for the main modal container div
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null); // Ref for the first focusable element (e.g., 'x' close button)
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null);  // Ref for the last focusable element (e.g., 'Close' button at the bottom)

  // When the attraction changes, reset the loading and error states for the new image
  useEffect(() => {
    if (attraction) {
      setImageError(false);
      setIsMainImageLoading(true);
    }
  }, [attraction]);

  // Effect to set initial focus to the first focusable element (the 'x' button) when the modal opens.
  useEffect(() => {
    if (attraction && firstFocusableElementRef.current) {
      firstFocusableElementRef.current.focus();
    }
  }, [attraction]); // Dependency: run when 'attraction' prop changes (modal opens/content changes)

  // Internal wrapper for the onClose prop to also handle returning focus.
  const handleClose = useCallback(() => {
    onClose(); // Call the original onClose prop (likely from App.tsx to set selectedAttraction to null)
    if (triggeringElementRef?.current) {
      triggeringElementRef.current.focus(); // Return focus to the element that opened the modal
    }
  }, [onClose, triggeringElementRef]);

  // Effect for handling keyboard interactions: Escape key for closing and Tab/Shift+Tab for focus trapping.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!modalRef.current) return; // Ensure modal is rendered

      // Close modal on Escape key press
      if (event.key === 'Escape') {
        handleClose(); // Use internal handleClose to ensure focus is returned correctly
        return;
      }

      // Trap focus within the modal on Tab key press
      if (event.key === 'Tab') {
        // Find all focusable elements within the modal that are currently visible and part of the layout
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => el.offsetParent !== null); // Check el.offsetParent to ensure element is visible

        if (focusableElements.length === 0) return; // No focusable elements found

        // Determine the actual first and last focusable elements, preferring the explicitly reffed ones
        const firstElement = firstFocusableElementRef.current && focusableElements.includes(firstFocusableElementRef.current)
                             ? firstFocusableElementRef.current
                             : focusableElements[0];
        const lastElement = lastFocusableElementRef.current && focusableElements.includes(lastFocusableElementRef.current)
                            ? lastFocusableElementRef.current
                            : focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab (moving focus backwards)
          if (document.activeElement === firstElement) {
            lastElement.focus(); // Wrap focus to the last element
            event.preventDefault();
          }
        } else { // Tab (moving focus forwards)
          if (document.activeElement === lastElement) {
            firstElement.focus(); // Wrap focus to the first element
            event.preventDefault();
          }
        }
      }
    };

    // Add event listener when the modal is active (attraction is not null)
    if (attraction) {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Clean up event listener when the modal closes or the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [attraction, handleClose]); // Dependencies for the effect

  if (!attraction) return null; // Don't render if no attraction is selected

  return (
    <div
      ref={modalRef} // Assign ref to the main modal div for querying focusable elements
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="attraction-detail-title"
    >
      <div className="bg-card-background text-text-primary p-4 sm:p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 id="attraction-detail-title" className="text-xl sm:text-2xl font-bold text-primary">
            {attraction.name}
          </h2>
          {/* Assigns ref to the 'x' close button, considered the first focusable element */}
          <button
            ref={firstFocusableElementRef}
            onClick={handleClose}
            className="text-muted-text hover:text-text-primary text-2xl p-1 -m-1 sm:p-2 sm:-m-2"
            aria-label="Close attraction details"
          >
            &times;
          </button>
        </div>

        {attraction.photos && attraction.photos.length > 0 && (
          <div className="mb-3 sm:mb-4">
            {isMainImageLoading && !imageError && (
              <div className="w-full h-48 sm:h-64 bg-gray-300 rounded-md mb-2 animate-pulse"></div>
            )}
            <img
              src={attraction.photos[0]}
              alt={attraction.name}
              className={`w-full h-48 sm:h-64 object-cover rounded-md mb-2 ${isMainImageLoading || imageError ? 'hidden' : 'block'}`}
              onLoad={() => setIsMainImageLoading(false)}
              onError={() => {
                setImageError(true);
                setIsMainImageLoading(false);
              }}
            />
            {imageError && (
              <div className="w-full h-48 sm:h-64 flex items-center justify-center bg-gray-200 rounded-md mb-2">
                <span className="text-gray-500">Image not available</span>
              </div>
            )}
            {attraction.photos.length > 1 && (
              <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
                {attraction.photos.slice(1).map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${attraction.name} thumbnail ${index + 2}`}
                    className="w-20 h-12 sm:w-24 sm:h-16 object-cover rounded"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-muted-text mb-1 text-sm">Category: {attraction.category}</p>
        <p className="text-lg mb-3">{attraction.description}</p>
        <div className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-1 mb-4">
          <p><strong>Rating:</strong> {attraction.rating} / 5</p>
          <p><strong>Hours:</strong> {attraction.hours.open} - {attraction.hours.close}</p>
          {attraction.averageVisitDuration && (
            <p><strong>Avg. Visit:</strong> {attraction.averageVisitDuration} minutes</p>
          )}
          {attraction.website && (
            <p><strong>Website:</strong> <a href={attraction.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{attraction.website}</a></p>
          )}
        </div>

        <button
          onClick={() => {
            if (attraction) {
              addAttractionToItinerary(attraction);
            }
          }}
          disabled={isAttractionInItinerary(attraction.id)}
          className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-secondary w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isAttractionInItinerary(attraction.id) ? 'Added to Itinerary' : 'Add to Itinerary'}
        </button>

        {/* Assigns ref to the 'Close' button at the bottom, considered the last focusable element */}
        <button
          ref={lastFocusableElementRef}
          onClick={handleClose}
          className="mt-2 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AttractionDetailCard;
