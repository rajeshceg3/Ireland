import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Attraction } from '../types/attraction';
import { useItinerary } from '../context/ItineraryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Globe, Star, MapPin, Check, Plus, ArrowRight } from 'lucide-react';

interface Props {
  attraction: Attraction | null;
  onClose: () => void;
  triggeringElementRef?: React.RefObject<HTMLElement | null>;
}

const AttractionDetailCard: React.FC<Props> = ({ attraction, onClose, triggeringElementRef }) => {
  const { addAttractionToItinerary, isAttractionInItinerary } = useItinerary();
  const [imageError, setImageError] = useState(false);
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (attraction) {
      setImageError(false);
      setIsMainImageLoading(true);
      setJustAdded(false);
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

  const handleAddToItinerary = () => {
    if (attraction) {
        addAttractionToItinerary(attraction);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
    }
  };

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

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, damping: 20 } }
  };

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
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-md transition-all"
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            className="bg-card-background text-text-primary rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative z-10 scrollbar-hide flex flex-col overflow-hidden border border-white/20"
          >
             {/* Image Header with Parallax-like feel */}
            <div className="relative h-64 sm:h-72 w-full shrink-0 overflow-hidden group">
                {isMainImageLoading && !imageError && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <motion.img
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
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

                <motion.button
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.5 }}
                    ref={firstFocusableElementRef}
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md border border-white/20 shadow-sm"
                    aria-label="Close attraction details"
                >
                    <X size={20} />
                </motion.button>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20">
                     <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-primary text-white mb-2 shadow-sm"
                    >
                        {attraction.category}
                    </motion.span>
                    <motion.h2
                        layoutId={`title-${attraction.id}`}
                        className="text-3xl font-bold text-white shadow-sm leading-tight"
                    >
                        {attraction.name}
                    </motion.h2>
                </div>
            </div>

            <motion.div
                className="p-6 space-y-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Stats Row */}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4 text-sm text-muted-text bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                        <Star className="text-yellow-400 fill-current" size={18} />
                        <span className="font-bold text-text-primary text-base">{attraction.rating}</span>/5
                    </div>
                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-primary" />
                        <span>{attraction.hours.open} - {attraction.hours.close}</span>
                    </div>
                </motion.div>

                <motion.p variants={itemVariants} className="text-text-primary leading-relaxed text-base font-normal opacity-90">
                    {attraction.description}
                </motion.p>

                {attraction.website && (
                    <motion.a
                        variants={itemVariants}
                        href={attraction.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium transition-colors group"
                    >
                        <Globe size={18} />
                        <span>Visit Official Website</span>
                        <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </motion.a>
                )}

                {/* Thumbnails */}
                {attraction.photos && attraction.photos.length > 1 && (
                  <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-2">
                    {attraction.photos.slice(1).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${attraction.name} thumbnail ${index + 2}`}
                        className="w-24 h-16 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform cursor-pointer border-2 border-transparent hover:border-primary"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                      />
                    ))}
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="pt-2 flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToItinerary}
                      disabled={isAttractionInItinerary(attraction.id)}
                      className={`
                        w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all relative overflow-hidden
                        ${isAttractionInItinerary(attraction.id)
                            ? 'bg-green-500 cursor-default ring-4 ring-green-500/20'
                            : 'bg-primary hover:bg-primary/90'
                        }
                      `}
                    >
                        <AnimatePresence mode='wait'>
                          {isAttractionInItinerary(attraction.id) ? (
                              <motion.div
                                key="added"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-2"
                              >
                                <Check size={20} strokeWidth={3} />
                                <span>{justAdded ? "Added!" : "In Your Itinerary"}</span>
                              </motion.div>
                          ) : (
                              <motion.div
                                key="add"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-2"
                              >
                                <Plus size={20} strokeWidth={3} />
                                <span>Add to Itinerary</span>
                              </motion.div>
                          )}
                        </AnimatePresence>
                    </motion.button>

                    <button
                      ref={lastFocusableElementRef}
                      onClick={handleClose}
                      className="w-full py-3.5 px-4 rounded-xl font-medium text-muted-text hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Close Details
                    </button>
                </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AttractionDetailCard;
