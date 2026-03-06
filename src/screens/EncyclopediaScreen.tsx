import React, { useState } from 'react';
import { Search, Bookmark, ChevronDown, X } from 'lucide-react';
import { Acupoint } from '../types';
import { motion } from 'motion/react';

interface EncyclopediaScreenProps {
  onSelectPoint: (id: string) => void;
  acupoints: Acupoint[];
}

export const EncyclopediaScreen: React.FC<EncyclopediaScreenProps> = ({ onSelectPoint, acupoints }) => {
  const [activeCategory, setActiveCategory] = useState('Head');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['Head', 'Torso', 'Arms', 'Legs'];
  const filters = ['Pain Relief', 'Digestion', 'Sleep'];

  const filteredPoints = acupoints.filter(p => {
    const matchesCategory = p.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.englishName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col overflow-hidden pb-24"
    >
      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="flex w-full items-stretch rounded-xl h-12 bg-white shadow-sm border border-primary/10">
          <div className="text-primary flex items-center justify-center pl-4">
            <Search size={20} />
          </div>
          <input
            className="flex w-full border-none bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-400 text-base font-normal px-4"
            placeholder="Search points (e.g. LI4, Hegu)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="pr-4 flex items-center text-slate-400"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Body Part Categories */}
      <div className="sticky top-0 z-40 bg-background-light">
        <div className="flex border-b border-primary/10 px-4 gap-8 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 shrink-0 transition-colors ${activeCategory === cat ? 'border-primary text-primary' : 'border-transparent text-slate-500'
                }`}
            >
              <p className={`text-sm ${activeCategory === cat ? 'font-bold' : 'font-medium'}`}>{cat}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar items-center">
        <button className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary/10 px-4 text-primary border border-primary/20">
          <span className="text-sm font-semibold">Pain Relief</span>
          <ChevronDown size={16} />
        </button>
        {filters.slice(1).map(f => (
          <button key={f} className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-slate-600 border border-slate-200">
            <span className="text-sm font-medium">{f}</span>
            <ChevronDown size={16} />
          </button>
        ))}
      </div>

      {/* Acupoint List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {filteredPoints.length > 0 ? (
          filteredPoints.map((point) => (
            <div
              key={point.id}
              onClick={() => onSelectPoint(point.id)}
              className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm border border-primary/5 cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img
                  alt={point.name}
                  className="h-full w-full object-cover"
                  src={point.image}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{point.code} ({point.name})</h3>
                  <Bookmark className="text-primary" size={18} />
                </div>
                <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                  {point.englishName}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {point.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400">
            No points found in this category.
          </div>
        )}
      </div>
    </motion.div>
  );
};
