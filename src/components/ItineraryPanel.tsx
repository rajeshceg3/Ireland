import React, { useState } from 'react';
import { parseItineraryRestore } from '../context/restore';
import { Attraction } from '../types/attraction';
import { useItinerary } from '../context/ItineraryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Compass, Tent, Share2 } from 'lucide-react';

const ItineraryPanel = () => {
  const { itinerary, removeAttractionFromItinerary, saveStatus, exportRecovery, restoreSelected } = useItinerary();

  const [selected,setSelected]=useState<Attraction[]|null>(null);
  const [restoreStatus,setRestoreStatus]=useState('');
  const fileRef=React.useRef<HTMLInputElement>(null);
  const choose=async()=>{setSelected(null);try{const f=fileRef.current?.files?.[0];if(!f||f.size>250000)throw Error();const v=parseItineraryRestore(await f.text());setSelected(v);setRestoreStatus(v.length?`Selected ordered version: ${v.map((x:any)=>x.name).join(' → ')}. Confirm to replace this browser itinerary.`:'Selected empty version. Confirming explicitly removes all current stops.')}catch{setRestoreStatus('Restore not accepted. Wrong app or malformed file. Existing itinerary is unchanged.')}};
  return (
    <aside className="h-full glass-panel border-l border-white/40 p-6 pt-24 shadow-2xl overflow-y-auto flex flex-col relative z-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-transparent z-10 backdrop-blur-xl -mx-6 px-6 py-4 border-b border-white/20">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm border border-primary/20">
                <Compass size={24} className="animate-spin-slow" />
            </div>
            <div>
                 <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Your Trip</h2>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Plan your adventure</p>
            </div>
        </div>
        <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-glow">
            {itinerary.length}
        </span>
      </div>

      <div className="mb-5 text-sm leading-relaxed p-3 bg-white/80 rounded-xl text-slate-800">
        <p role="status">{saveStatus}</p>
        <button onClick={exportRecovery} className="my-2 p-3 border rounded-lg font-bold">Download recovery file</button>
        <a href="https://saved-apps.vercel.app/" target="_blank" rel="noopener noreferrer" className="block underline p-2">Open private saved-apps home</a>
        <p>Choose your recovery file there, press Import selected file, then wait for Cloud save confirmed. Nothing uploads automatically.</p>
      </div>
      <section className="mb-5 p-3 bg-white/80 rounded-xl text-sm leading-relaxed text-slate-800"><h3 className="font-bold">Restore a private itinerary version</h3><p>Export a selected version from the private home. Choose it here, review, then confirm. This replaces this browser itinerary, including an explicitly empty version. A prior recovery copy is kept and downloaded first.</p><label className="block py-2">Choose itinerary restore file<input type="file" accept=".json,application/json" ref={fileRef} onChange={()=>{setSelected(null);setRestoreStatus('File selected. Press Preview selected itinerary. Nothing changed.')}} className="block max-w-full" /></label><button onClick={choose} className="p-3 border rounded-lg">Preview selected itinerary</button><p role="status">{restoreStatus}</p><button disabled={selected===null} onClick={()=>{if(selected!==null&&restoreSelected(selected)){setSelected(null);setRestoreStatus('Selected itinerary restored in this browser. This does not sync new changes to the private home.')}}} className="p-3 border rounded-lg disabled:opacity-50">Keep prior copy and restore selected itinerary</button></section>
      {itinerary.some(x => /^([4-9]|1[0-5])$/.test(x.id)) && <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">Your trip contains records from the earlier demo catalogue. Their saved names and coordinates are preserved, but those numbered places were not verified. Review them before travelling; no stop was replaced or removed.</p>}
      {/* Content */}
      {itinerary.length === 0 ? (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex-grow flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-surface/30 border border-white/40 dark:bg-slate-800/30 dark:border-white/10"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-full mb-6 shadow-inner"
            >
                <Tent size={48} className="text-primary opacity-80" />
            </motion.div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Time to Explore!</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[220px]">
                Your itinerary is looking a bit empty. Browse the map and add some amazing places to your list.
            </p>
        </motion.div>
      ) : (
        <ul className="space-y-4 pb-24 flex-grow">
            <AnimatePresence mode="popLayout">
            {itinerary.map((attraction, index) => (
                <motion.li
                    key={attraction.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: -50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 50 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl shadow-sm border border-white/50 dark:border-white/10 flex justify-between items-center group relative overflow-hidden backdrop-blur-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                >
                    <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-bold text-slate-800 dark:text-white truncate text-base group-hover:text-primary transition-colors">
                            {attraction.name}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider inline-block mt-1 bg-white/50 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                            {attraction.category}
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.2, rotate: 15, color: '#EF4444' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeAttractionFromItinerary(attraction.id)}
                        className="text-slate-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label={`Remove ${attraction.name} from itinerary`}
                    >
                        <Trash2 size={18} />
                    </motion.button>
                </motion.li>
            ))}
            </AnimatePresence>
        </ul>
      )}

      {/* Footer Actions */}
      <AnimatePresence>
      {itinerary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative mt-auto p-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 z-20"
          >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(var(--color-primary), 0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={exportRecovery}
                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    <Share2 size={20} />
                    Download private recovery file
                  </span>
              </motion.button>
          </motion.div>
      )}
      </AnimatePresence>
    </aside>
  );
};

export default ItineraryPanel;
