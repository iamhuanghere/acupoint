/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Bell, Settings, Activity } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { EncyclopediaScreen } from './screens/EncyclopediaScreen';
import { DetailScreen } from './screens/DetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ARScanScreen } from './screens/ARScanScreen';
import { useAcupoints } from './hooks/useAcupoints';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { acupoints, loading, error } = useAcupoints();

  const selectedPoint = acupoints.find(p => p.id === selectedPointId);

  const renderContent = () => {
    if (selectedPointId && selectedPoint) {
      return (
        <DetailScreen
          point={selectedPoint}
          onBack={() => setSelectedPointId(null)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToEncyclopedia={() => setActiveTab('encyclopedia')}
            onSelectPoint={setSelectedPointId}
            onStartScan={() => setIsScanning(true)}
            acupoints={acupoints}
          />
        );
      case 'encyclopedia':
        return (
          <EncyclopediaScreen
            onSelectPoint={setSelectedPointId}
            acupoints={acupoints}
          />
        );
      case 'profile':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-light">
        <Activity className="text-primary animate-pulse mb-4" size={48} />
        <p className="text-slate-500 font-medium">Loading AcuPoint AI...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 text-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-4 text-sm font-medium border border-red-100 max-w-md w-full">
          {error}
        </div>
        <p className="text-slate-500 text-sm">Please make sure the backend server and Supabase are properly configured.</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light">
      <AnimatePresence>
        {isScanning && (
          <ARScanScreen onClose={() => setIsScanning(false)} />
        )}
      </AnimatePresence>

      {/* Header - only show if not in detail view and not scanning */}
      {!selectedPointId && !isScanning && (
        <header className="flex items-center bg-background-light p-4 justify-between sticky top-0 z-10 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Activity className="text-primary" size={24} />
            </div>
            <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">AcuPoint AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
              <Bell className="text-slate-700" size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
              <Settings className="text-slate-700" size={20} />
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      {/* Bottom Nav - only show if not in detail view and not scanning */}
      {!selectedPointId && !isScanning && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
