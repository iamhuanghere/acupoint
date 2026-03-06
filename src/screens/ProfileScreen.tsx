import React from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Award, 
  Bookmark, 
  Clock 
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProfileScreen: React.FC = () => {
  const menuItems = [
    { icon: Settings, label: 'Settings', color: 'text-slate-600' },
    { icon: Bell, label: 'Notifications', color: 'text-slate-600' },
    { icon: Shield, label: 'Privacy & Security', color: 'text-slate-600' },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-slate-600' },
  ];

  const stats = [
    { icon: Award, label: 'Learned', value: '12', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Bookmark, label: 'Saved', value: '8', color: 'bg-primary/10 text-primary' },
    { icon: Clock, label: 'History', value: '24', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto pb-24"
    >
      {/* User Header */}
      <div className="px-4 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
            <img 
              src="https://picsum.photos/seed/user123/200/200" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-primary text-slate-900 p-1.5 rounded-full border-2 border-white shadow-sm">
            <Settings size={14} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Dr. Chen Wei</h2>
        <p className="text-sm text-slate-500">TCM Practitioner • Senior Member</p>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex flex-col items-center text-center">
                <div className={`p-2 rounded-xl mb-2 ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-lg font-bold text-slate-900">{stat.value}</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-50 overflow-hidden">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={idx} 
                className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${
                  idx !== menuItems.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-50 ${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-medium text-slate-700">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            );
          })}
        </div>

        <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* App Version */}
      <div className="mt-10 text-center text-slate-300 text-[10px] font-medium uppercase tracking-widest">
        AcuPoint AI v1.2.0
      </div>
    </motion.div>
  );
};
