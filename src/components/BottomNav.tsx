import React from 'react';
import { LayoutDashboard, FolderKanban, History, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'projects' | 'log' | 'insights';
  setActiveTab: (tab: 'dashboard' | 'projects' | 'log' | 'insights') => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'log', label: 'Log', icon: History },
    { id: 'insights', label: 'Insights', icon: Sparkles },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-stone-200/60 px-6 py-2 z-40">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-stone-900 font-semibold'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-0.5 ${
                  isActive ? 'stroke-[2.25px]' : 'stroke-[1.75px]'
                }`}
              />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
