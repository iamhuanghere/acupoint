import React from 'react';
import { ArrowLeft, Share2, MapPin, Activity, Info, Headphones, Stethoscope, Thermometer, Moon, Brain, Eye, Zap } from 'lucide-react';
import { Acupoint } from '../types';
import { motion } from 'motion/react';

interface DetailScreenProps {
  point: Acupoint;
  onBack: () => void;
}

const IconMap: Record<string, any> = {
  Headphones,
  Stethoscope,
  Thermometer,
  Activity,
  Moon,
  Brain,
  Eye,
  Zap
};

export const DetailScreen: React.FC<DetailScreenProps> = ({ point, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col bg-background-light overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center bg-white p-4 border-b border-primary/10 sticky top-0 z-10">
        <button onClick={onBack} className="text-slate-900 flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Acupoint Detail</h1>
        <div className="flex w-10 items-center justify-end">
          <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-transparent text-slate-900">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-10">
        {/* Hero Image Section */}
        <div className="relative h-[320px] w-full overflow-hidden">
          <img 
            src={point.image} 
            alt={point.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-6">
            <span className="bg-primary text-slate-900 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full w-fit mb-2">
              {point.meridian}
            </span>
            <h2 className="text-white text-3xl font-bold leading-tight">{point.name} ({point.code})</h2>
            <p className="text-primary font-medium">{point.englishName}</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-4 py-6 space-y-8">
          {/* Section 1: Location */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-primary" size={20} />
              <h3 className="text-xl font-bold tracking-tight">Location</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-primary/5 shadow-sm">
              <p className="text-slate-700 leading-relaxed">
                {point.location}
              </p>
            </div>
          </section>

          {/* Section 2: Main Functions */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-primary" size={20} />
              <h3 className="text-xl font-bold tracking-tight">Main Functions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {point.functions.map((func, idx) => {
                const Icon = IconMap[func.icon] || Info;
                return (
                  <div key={idx} className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex flex-col gap-1">
                    <Icon className="text-primary" size={20} />
                    <span className="font-bold text-sm">{func.title}</span>
                    <span className="text-xs text-slate-500">{func.subtitle}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 3: Techniques */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-primary" size={20} />
              <h3 className="text-xl font-bold tracking-tight">Techniques</h3>
            </div>
            <div className="space-y-4">
              {point.techniques.map((tech, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="bg-slate-200 h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-primary">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-base mb-1">{tech.title}</h4>
                    <p className="text-sm text-slate-600">{tech.description}</p>
                  </div>
                </div>
              ))}

              {point.contraindication && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1 text-yellow-600">
                    <Info size={14} />
                    <span className="text-xs font-bold uppercase">Contraindication</span>
                  </div>
                  <p className="text-xs text-slate-600 italic font-medium">
                    {point.contraindication}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
