import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';
import SettingsModal from './components/SettingsModal';
import EnergyCalibrationModal from './components/EnergyCalibrationModal';
import LogView from './components/LogView';
import { defaultPreferences, type EnergyLogEntry } from './config/appConfig';
import type { UserPreferences } from './config/appConfig';
import { Sliders } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'log' | 'insights'>('dashboard');
  const [moneyBalance, setMoneyBalance] = useState(2450);
  const [energyBattery, setEnergyBattery] = useState(72);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);

  // Safe lazy initialization of energyLogs with localStorage and fallback array
  const [energyLogs, setEnergyLogs] = useState<EnergyLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('pace_purse_energy_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse energy logs from localStorage', e);
    }
    return [];
  });

  // Load and persist preferences in localStorage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('pace_purse_prefs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse preferences from localStorage', e);
    }
    return defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('pace_purse_prefs', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('pace_purse_energy_logs', JSON.stringify(energyLogs));
  }, [energyLogs]);

  // Handler when a new energy calibration/log is saved
  const handleSaveCalibration = (
    newLevel: number,
    notes: { tags: string[]; comment: string }
  ) => {
    setEnergyBattery(newLevel);
    const newEntry: EnergyLogEntry = {
      id: `entry-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: newLevel,
      tierLabel: newLevel > 75 ? 'Tier 1' : newLevel > 50 ? 'Tier 2' : newLevel > 25 ? 'Tier 3' : 'Tier 4',
      tags: notes.tags,
      note: notes.comment,
    };
    setEnergyLogs((prev) => [newEntry, ...(prev || [])]);
  };

  // Dynamic font sizing based on user selection
  const fontSizeClass = 
    preferences.fontSize === 'xlarge' ? 'text-lg' :
    preferences.fontSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div className={`min-h-screen bg-[#FAF9F5] text-stone-950 flex flex-col font-sans pb-24 ${fontSizeClass} ${preferences.highContrast ? 'contrast-125' : ''}`}>
      
      {/* Settings Trigger */}
      <div className="max-w-md w-full mx-auto px-4 pt-4 flex justify-end">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 rounded-2xl bg-white border-2 border-stone-300 text-stone-800 hover:bg-stone-50 min-h-[48px] min-w-[48px] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          aria-label="Open settings and accessibility options"
        >
          <Sliders className="w-5 h-5" />
        </button>
      </div>

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-2 pb-4">
        {activeTab === 'dashboard' && (
          <Dashboard 
            moneyBalance={moneyBalance} 
            energyBattery={energyBattery}
            currencySymbol={preferences.moneyCurrencySymbol}
            energyUnit={preferences.energyUnitLabel}
            onOpenCalibrate={() => setIsCalibrationOpen(true)}
            onNavigateLog={() => setActiveTab('log')}
          />
        )}
        {activeTab === 'projects' && (
          <div className="py-8 text-center text-stone-700 font-medium">Projects View Coming Soon</div>
        )}
        {activeTab === 'log' && (
          <LogView 
            energyLogs={energyLogs}
            preferences={preferences}
            onOpenCalibration={() => setIsCalibrationOpen(true)}
          />
        )}
        {activeTab === 'insights' && (
          <div className="py-8 text-center text-stone-700 font-medium">Insights View Coming Soon</div>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        setPreferences={setPreferences}
      />

      <EnergyCalibrationModal 
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        onSave={handleSaveCalibration}
        currentBattery={energyBattery}
        preferences={preferences}
      />
    </div>
  );
}