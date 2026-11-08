import React, { useState } from 'react';
import { parseItineraryRestore } from '../context/restore';
import { Attraction } from '../types/attraction';
import { useItinerary } from '../context/ItineraryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Compass, Tent } from 'lucide-react';

const ItineraryPanel = () => {
  const { itinerary, removeAttractionFromItinerary, saveStatus, exportRecovery, restoreSelected } = useItinerary();

  const [selected,setSelected]=useState<Attraction[]|null>(null);
  const [restoreStatus,setRestoreStatus]=useState('');
  const [restoreOpen,setRestoreOpen]=useState(false);
  const [fileChosen,setFileChosen]=useState(false);
  const nextClass='bg-violet-700 text-white border-violet-700 font-bold shadow-md hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500';
  const quietClass='border-slate-400 text-slate-800 bg-white hover:bg-slate-50';
  const fileRef=React.useRef<HTMLInputElement>(null);
  const choose=async()=>{setSelected(null);try{const f=fileRef.current?.files?.[0];if(!f||f.size>250000)throw Error();const v=parseItineraryRestore(await f.text());setSelected(v);setRestoreStatus(v.length?`Selected ordered version: ${v.map((x:any)=>x.name).join(' → ')}. Confirm to replace this browser itinerary.`:'Selected empty version. Confirming explicitly removes all current stops.')}catch{setRestoreStatus('Restore not accepted. Wrong app or malformed file. Existing itinerary is unchanged.')}};
  return (
    <aside className="h-full bg-white dark:bg-slate-900 border-l border-white/40 p-6 pt-0 shadow-2xl overflow-y-auto scroll-pt-28 flex flex-col relative z-50">
      {/* Header */}
      <div className="flex items-center justify-between pr-16 mb-8 sticky top-0 bg-white dark:bg-slate-900 z-10 backdrop-blur-xl -mx-6 px-6 py-4 border-b border-white/20">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm border border-primary/20">
                <Compass size={24} className="animate-spin-slow" />
            </div>
            <div>
                 <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Your Trip</h2>

            </div>
        </div>
        <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-glow">
            {itinerary.length}
        </span>
      </div>

      <section aria-label="Itinerary recovery" className="mb-5 text-sm leading-relaxed p-4 bg-slate-100 rounded-xl text-slate-800">
        <p role="status">{saveStatus}</p>
        <button onClick={exportRecovery} className={`scroll-mt-28 my-3 min-h-11 p-3 border rounded-lg w-full ${restoreOpen ? quietClass : nextClass}`}>Download recovery file</button>
        <details className="border-t border-slate-300 pt-2">
          <summary className="min-h-11 py-3 cursor-pointer">Keep a copy in the private home</summary>
          <p className="mb-2">Download above, then import that file in the private home. Wait for "Cloud save confirmed". Nothing uploads automatically.</p>
          <a href="https://saved-apps.vercel.app/" target="_blank" rel="noopener noreferrer" className="block underline py-3 min-h-11">Open private saved-apps home</a>
        </details>
      </section>
      <details className="mb-5 p-4 bg-slate-100 rounded-xl text-sm leading-relaxed text-slate-800" onToggle={e=>setRestoreOpen(e.currentTarget.open)}>
        <summary className="font-bold min-h-11 py-3 cursor-pointer">Restore a private itinerary version</summary>
        <p>Export a selected version from the private home. Choose it here, review, then confirm.</p>
        <p className="my-3 font-semibold">Confirming replaces this browser itinerary, even with an empty version. A prior recovery copy is kept and downloaded first.</p>
        <label className="block py-2 scroll-mt-28">Choose itinerary restore file<input type="file" accept=".json,application/json" ref={fileRef} onChange={()=>{setSelected(null);setFileChosen(!!fileRef.current?.files?.length);setRestoreStatus('File selected. Press Preview selected itinerary. Nothing changed.')}} className="block max-w-full mt-2" /></label>
        <button onClick={choose} className={`scroll-mt-28 my-2 min-h-11 p-3 border rounded-lg w-full ${fileChosen && selected===null ? nextClass : quietClass}`}>Preview selected itinerary</button>
        <p role="status" className="my-2">{restoreStatus}</p>
        <button disabled={selected===null} onClick={()=>{if(selected!==null&&restoreSelected(selected)){setSelected(null);setFileChosen(false);setRestoreStatus('Selected itinerary restored in this browser. This does not sync new changes to the private home.')}}} className={`scroll-mt-28 min-h-11 p-3 border rounded-lg w-full ${selected!==null ? nextClass : quietClass} disabled:opacity-50 disabled:cursor-not-allowed`}>Keep prior copy and restore selected itinerary</button>
      </details>
      {itinerary.some(x => /^([4-9]|1[0-5])$/.test(x.id)) && <p className="mb-4 scroll-mt-28 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">Your trip contains records from the earlier demo catalogue. Their saved names and coordinates are preserved, but those numbered places were not verified. Review them before travelling; no stop was replaced or removed.</p>}
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

    </aside>
  );
};

export default ItineraryPanel;
