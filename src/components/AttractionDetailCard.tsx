import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Attraction } from '../types/attraction';
import { useItinerary } from '../context/ItineraryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Globe, Star, MapPin, Check, Plus } from 'lucide-react';

interface Props {
  attraction: Attraction | null;
  onClose: () => void;
  triggeringElementRef?: React.RefObject<HTMLElement | null>;
}

const AttractionDetailCard: React.FC<Props> = ({ attraction, onClose, triggeringElementRef }) => {
  const { addAttractionToItinerary, isAttractionInItinerary } = useItinerary();
  const [imageError, setImageError] = useState(false);
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (attraction) {
      setImageError(false);
      setIsMainImageLoading(true);
    }
  }, [attraction]);

  useEffect(() => {
    if (attraction && firstFocusableElementRef.current) {
      firstFocusableElementRef.current.focus();
    }
  }, [attraction]);

  const handleClose = useCallback(() => {
    onClose();
    if (triggeringElementRef?.current) {
      triggeringElementRef.current.focus();
    }
  }, [onClose, triggeringElementRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!modalRef.current) return;
      if (event.key === 'Escape') {
        handleClose();
        return;
      }
      if (event.key === 'Tab') {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => el.offsetParent !== null);

        if (focusableElements.length === 0) return;

        const firstElement = firstFocusableElementRef.current && focusableElements.includes(firstFocusableElementRef.current)
                             ? firstFocusableElementRef.current
                             : focusableElements[0];
        const lastElement = lastFocusableElementRef.current && focusableElements.includes(lastFocusableElementRef.current)
                            ? lastFocusableElementRef.current
                            : focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (attraction) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [attraction, handleClose]);

  return (
    <AnimatePresence>
      {attraction && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="attraction-detail-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-card-background text-text-primary rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative z-10 scrollbar-hide flex flex-col"
          >
             {/* Image Header */}
            <div className="relative h-56 sm:h-64 w-full shrink-0">
                {isMainImageLoading && !imageError && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <img
                  src={attraction.photos && attraction.photos.length > 0 ? attraction.photos[0] : ''}
                  alt={attraction.name}
                  className={`w-full h-full object-cover ${isMainImageLoading || imageError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                  onLoad={() => setIsMainImageLoading(false)}
                  onError={() => { setImageError(true); setIsMainImageLoading(false); }}
                />
                 {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                        <MapPin size={48} opacity={0.5} />
                    </div>
                )}

                <button
                    ref={firstFocusableElementRef}
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                    aria-label="Close attraction details"
                >
                    <X size={20} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12">
                     <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-primary text-white mb-1">
                        {attraction.category}
                    </span>
                    <h2 id="attraction-detail-title" className="text-2xl font-bold text-white shadow-sm">
                        {attraction.name}
                    </h2>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {/* Stats Row */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-text">
                    <div className="flex items-center gap-1.5">
                        <Star className="text-yellow-400 fill-current" size={16} />
                        <span className="font-medium text-text-primary">{attraction.rating}</span>/5
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span>{attraction.hours.open} - {attraction.hours.close}</span>
                    </div>
                    {attraction.averageVisitDuration && (
                        <div className="flex items-center gap-1.5">
                            <span className="font-medium">Avg:</span> {attraction.averageVisitDuration} min
                        </div>
                    )}
                </div>

                <p className="text-text-primary leading-relaxed text-base">
                    {attraction.description}
                </p>

                {attraction.website && (
                    <a
                        href={attraction.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium transition-colors"
                    >
                        <Globe size={16} />
                        Visit Website
                    </a>
                )}

                {/* Thumbnails */}
                {attraction.photos && attraction.photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {attraction.photos.slice(1).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${attraction.name} thumbnail ${index + 2}`}
                        className="w-20 h-14 object-cover rounded-lg shadow-sm hover:opacity-80 transition-opacity cursor-pointer border border-gray-100"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                      />
                    ))}
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => attraction && addAttractionToItinerary(attraction)}
                      disabled={isAttractionInItinerary(attraction.id)}
                      className={`
                        w-full py-3 px-4 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all
                        ${isAttractionInItinerary(attraction.id)
                            ? 'bg-green-500 cursor-default'
                            : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
                        }
                      `}
                    >
                      {isAttractionInItinerary(attraction.id) ? (
                          <>
                            <Check size={20} /> Added to Itinerary
                          </>
                      ) : (
                          <>
                            <Plus size={20} /> Add to Itinerary
                          </>
                      )}
                    </motion.button>

                    <button
                      ref={lastFocusableElementRef}
                      onClick={handleClose}
                      className="w-full py-3 px-4 rounded-xl font-medium text-muted-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Close
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AttractionDetailCard;
