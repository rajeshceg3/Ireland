import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Attraction } from '../types/attraction';
import { useItinerary } from '../context/ItineraryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Globe, Star, MapPin, Check, Plus, ArrowRight, ExternalLink } from 'lucide-react';

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
            delayChildren: 0.1
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
          className="fixed inset-0 z-[60] flex justify-center items-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="attraction-detail-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            className="glass-panel text-text-primary rounded-[2rem] shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative z-10 scrollbar-hide flex flex-col overflow-hidden ring-1 ring-white/20"
          >
             {/* Image Header */}
            <div className="relative h-72 sm:h-80 w-full shrink-0 overflow-hidden group bg-gray-100">
                {isMainImageLoading && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  src={attraction.photos && attraction.photos.length > 0 ? attraction.photos[0] : ''}
                  alt={attraction.name}
                  className={`w-full h-full object-cover ${isMainImageLoading || imageError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
                  onLoad={() => setIsMainImageLoading(false)}
                  onError={() => { setImageError(true); setIsMainImageLoading(false); }}
                />
                 {imageError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-2">
                        <MapPin size={48} opacity={0.5} />
                        <span className="text-sm font-medium">Image not available</span>
                    </div>
                )}

                <motion.button
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.5 }}
                    ref={firstFocusableElementRef}
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-md border border-white/20 shadow-lg hover:rotate-90"
                    aria-label="Close attraction details"
                >
                    <X size={20} />
                </motion.button>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-32">
                     <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-2 mb-3"
                    >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/90 text-white shadow-sm backdrop-blur-sm">
                            {attraction.category}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-400 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            <Star className="fill-current" size={12} />
                            <span className="text-xs font-bold text-white">{attraction.rating}</span>
                        </div>
                    </motion.div>
                    <motion.h2
                        layoutId={`title-${attraction.id}`}
                        className="text-3xl sm:text-4xl font-extrabold text-white shadow-sm leading-none tracking-tight"
                    >
                        {attraction.name}
                    </motion.h2>
                </div>
            </div>

            <motion.div
                className="p-6 sm:p-8 space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex-grow"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Info Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl border border-white/40 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-2 text-primary mb-1">
                            <Clock size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Hours</span>
                        </div>
                        <p className="font-semibold text-text-primary text-sm">{attraction.hours.open} - {attraction.hours.close}</p>
                    </div>
                     <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl border border-white/40 dark:border-white/5 shadow-sm">
                         <a
                            href={attraction.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col h-full hover:opacity-70 transition-opacity"
                         >
                            <div className="flex items-center gap-2 text-secondary mb-1">
                                <Globe size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Website</span>
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-text-primary text-sm">
                                <span>Visit Site</span>
                                <ExternalLink size={12} />
                            </div>
                        </a>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h3 className="text-lg font-bold text-text-primary mb-2">About</h3>
                    <p className="text-text-primary/80 leading-relaxed text-base">
                        {attraction.description}
                    </p>
                </motion.div>

                {/* Thumbnails */}
                {attraction.photos && attraction.photos.length > 1 && (
                  <motion.div variants={itemVariants}>
                     <h3 className="text-sm font-bold text-muted-text mb-3 uppercase tracking-wider">Gallery</h3>
                      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                        {attraction.photos.slice(1).map((photo, index) => (
                        <motion.img
                            whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                            key={index}
                            src={photo}
                            alt={`${attraction.name} thumbnail ${index + 2}`}
                            className="w-28 h-20 object-cover rounded-xl shadow-md cursor-zoom-in border-2 border-white dark:border-slate-700"
                            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                        />
                        ))}
                      </div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="pt-4 flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToItinerary}
                      disabled={isAttractionInItinerary(attraction.id)}
                      className={`
                        w-full py-4 px-6 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group
                        ${isAttractionInItinerary(attraction.id)
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 cursor-default ring-4 ring-green-500/20'
                            : 'bg-gradient-to-r from-primary to-indigo-600 hover:shadow-primary/40'
                        }
                      `}
                    >
                         {/* Shine effect */}
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shimmer" />

                        <AnimatePresence mode='wait'>
                          {isAttractionInItinerary(attraction.id) ? (
                              <motion.div
                                key="added"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-2"
                              >
                                <Check size={24} strokeWidth={3} />
                                <span className="text-lg">{justAdded ? "Added to Trip!" : "In Your Itinerary"}</span>
                              </motion.div>
                          ) : (
                              <motion.div
                                key="add"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-2"
                              >
                                <Plus size={24} strokeWidth={3} />
                                <span className="text-lg">Add to Itinerary</span>
                              </motion.div>
                          )}
                        </AnimatePresence>
                    </motion.button>

                    <button
                      ref={lastFocusableElementRef}
                      onClick={handleClose}
                      className="w-full py-3 px-4 rounded-xl font-medium text-muted-text hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      Close Details
                    </button>
                </motion.div>
            </motion.div>
          </motion.div>
          <style>{`
            @keyframes shimmer {
                100% {
                    left: 200%;
                }
            }
            .animate-shimmer {
                animation: shimmer 1.5s infinite;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AttractionDetailCard;
