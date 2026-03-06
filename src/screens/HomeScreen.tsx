import React, { useState } from 'react';
import { Search, Camera, LayoutGrid, Accessibility, ChevronRight, X } from 'lucide-react';
import { Acupoint } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HomeScreenProps {
  onNavigateToEncyclopedia: () => void;
  onSelectPoint: (id: string) => void;
  onStartScan: () => void;
  acupoints: Acupoint[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToEncyclopedia, onSelectPoint, onStartScan, acupoints }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const pointOfTheDay = acupoints[0] || null;

  const filteredResults = searchQuery.trim()
    ? acupoints.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.englishName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto pb-24 relative"
    >
      {/* Search Bar */}
      <div className="px-4 py-6 sticky top-0 bg-background-light z-30">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-primary" size={20} />
          </div>
          <input
            className="block w-full pl-12 pr-10 py-4 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary text-slate-900 placeholder:text-slate-400"
            placeholder="Search acupoints (e.g., LI4, ST36)"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search Results Overlay */}
        <AnimatePresence>
          {searchQuery.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-[60vh] overflow-y-auto z-40"
            >
              {filteredResults.length > 0 ? (
                <div className="p-2">
                  {filteredResults.map((point) => (
                    <button
                      key={point.id}
                      onClick={() => {
                        onSelectPoint(point.id);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <img
                        src={point.image}
                        alt={point.name}
                        className="size-12 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{point.code} - {point.name}</h4>
                        <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">{point.englishName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm">No acupoints found for "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content (Blurred when searching) */}
      <div className={searchQuery.trim() !== '' ? 'blur-sm pointer-events-none transition-all' : 'transition-all'}>

        {/* AR Hero Section */}
        <div className="px-4 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3] flex flex-col items-center justify-center text-center p-6 shadow-xl border border-primary/20">
            <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/30 to-slate-900">
              <img
                alt="Human body anatomical points visualization"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ2Nal1xkgoA2E_ReW0e2ITMcdIOpCDK3UzvG3Bx4g9VPCMeUIqQABCEX-25D8UFUHXZnnFvr4OZgittg0h4lLbFEk7laUv3p2dyY38pzQkmPtzilVKWDLPu-bg6IvUpDI5GiBKo-1mkO-Ux7JEL8qOoTV5enXPp9qT2BO44ZMiV6SrLlO4lnPzQdqhH5sCPk6eE1Z8pKNiM2KXavsrR-cS0eMCNGTdRr4FqIWRD8TbdYqtnY4vv0B8PYOR7e3BYv6P2EKVdncAGw"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-white text-2xl font-bold mb-2">Live Identification</h2>
              <p className="text-primary/90 text-sm mb-8 max-w-[240px]">
                Point your camera to instantly identify and locate acupoints in real-time AR
              </p>
              <button
                onClick={onStartScan}
                className="flex items-center gap-3 bg-primary text-slate-900 font-bold py-4 px-8 rounded-full shadow-lg shadow-primary/40 hover:scale-105 transition-transform"
              >
                <Camera size={24} />
                <span>START AR SCAN</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="px-4 mb-8">
          <h3 className="text-slate-900 font-bold text-lg mb-4 flex items-center gap-2">
            <LayoutGrid className="text-primary" size={20} />
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={onNavigateToEncyclopedia}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <Accessibility className="text-primary group-hover:text-white" size={24} />
              </div>
              <h4 className="font-bold text-slate-900">Common Acupoints</h4>
              <p className="text-xs text-slate-500 mt-1">LI4, ST36, SP6 and more</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <LayoutGrid className="text-primary group-hover:text-white" size={24} />
              </div>
              <h4 className="font-bold text-slate-900">Body Map</h4>
              <p className="text-xs text-slate-500 mt-1">Explore by body region</p>
            </div>
          </div>
        </div>

        {/* Acupoint of the Day */}
        {pointOfTheDay && (
          <div className="px-4 mb-4">
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-slate-900 font-bold text-sm">Acupoint of the Day</h3>
                <button
                  onClick={() => onSelectPoint(pointOfTheDay.id)}
                  className="text-xs text-primary font-medium flex items-center gap-1"
                >
                  Read More <ChevronRight size={12} />
                </button>
              </div>
              <div className="flex gap-4">
                <img
                  alt={pointOfTheDay.name}
                  className="w-16 h-16 rounded-lg object-cover"
                  src={pointOfTheDay.image}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-slate-800">{pointOfTheDay.name} ({pointOfTheDay.code})</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                    {pointOfTheDay.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
