import React from 'react';
import { DollarSign, Zap, Plus } from 'lucide-react';
import { appConfig } from '../config/appConfig';
import type { UserPreferences } from '../config/appConfig';

interface DashboardProps {
  moneyBalance: number;
  energyBattery: number;
  preferences: UserPreferences;
  onOpenCalibration: () => void; // Added callback prop
}

export default function Dashboard({
  moneyBalance,
  energyBattery,
  preferences,
  onOpenCalibration,
}: DashboardProps) {
  const titleSize =
    preferences.fontSize === 'xlarge'
      ? 'text-2xl'
      : preferences.fontSize === 'large'
      ? 'text-xl'
      : 'text-lg';
  const numberSize =
    preferences.fontSize === 'xlarge'
      ? 'text-3xl'
      : preferences.fontSize === 'large'
      ? 'text-2xl'
      : 'text-xl';
  const bodySize =
    preferences.fontSize === 'xlarge'
      ? 'text-base'
      : preferences.fontSize === 'large'
      ? 'text-sm'
      : 'text-xs';

  return (
    <div className="space-y-5">
      {/* Top Header with Calibrate Energy Button */}
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1
            className={`font-semibold ${titleSize} ${
              appConfig.skin?.textPrimary || 'text-stone-950'
            }`}
          >
            {appConfig.name}
          </h1>
          <p
            className={`${bodySize} ${
              appConfig.skin?.textSecondary || 'text-stone-700'
            }`}
          >
            {appConfig.tagline}
          </p>
        </div>
        <button
          onClick={onOpenCalibration}
          className={`${bodySize} font-medium px-4 py-2.5 rounded-2xl bg-stone-200/80 text-stone-900 hover:bg-stone-200 transition-colors min-h-[48px] flex items-center justify-center shadow-xs cursor-pointer`}
        >
          Calibrate Energy
        </button>
      </header>

      {/* Dual Currency Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Money Currency Card */}
        <div
          className={`${
            appConfig.skin?.cardBackground || 'bg-white'
          } rounded-2xl p-4 ${
            appConfig.skin?.cardBorder || 'border-2 border-stone-300'
          } flex flex-col justify-between shadow-xs`}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={`${bodySize} font-medium ${
                appConfig.skin?.textSecondary || 'text-stone-700'
              }`}
            >
              Financial
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-950">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div
              className={`font-bold ${numberSize} ${
                appConfig.skin?.textPrimary || 'text-stone-950'
              }`}
            >
              {preferences.moneyCurrencySymbol}
              {moneyBalance.toLocaleString()}
            </div>
            <div
              className={`${bodySize} text-emerald-800 font-medium mt-1 flex items-center gap-0.5`}
            >
              <span>+320 {preferences.moneyCurrencySymbol} this week</span>
            </div>
          </div>
        </div>

        {/* Energy Currency Card */}
        <div
          className={`${
            appConfig.skin?.cardBackground || 'bg-white'
          } rounded-2xl p-4 ${
            appConfig.skin?.cardBorder || 'border-2 border-stone-300'
          } flex flex-col justify-between shadow-xs`}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={`${bodySize} font-medium ${
                appConfig.skin?.textSecondary || 'text-stone-700'
              }`}
            >
              Battery
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-950">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div
              className={`font-bold ${numberSize} ${
                appConfig.skin?.textPrimary || 'text-stone-950'
              }`}
            >
              {energyBattery}
              {preferences.energyUnitLabel}
            </div>
            {/* Battery Level Progress Bar */}
            <div className="w-full bg-stone-200 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, energyBattery))}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Insight Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs">
        <h3
          className={`${bodySize} font-bold text-amber-950 uppercase tracking-wider mb-1`}
        >
          Ambient Insight
        </h3>
        <p className={`${bodySize} text-amber-900 leading-relaxed`}>
          Energy is at {energyBattery}
          {preferences.energyUnitLabel}. Great window for high-focus task
          planning before scheduling financial commitments.
        </p>
      </div>

      {/* Quick Action Button */}
      <div className="pt-2">
        <button
          className={`w-full bg-stone-950 hover:bg-stone-900 text-white font-medium py-3.5 rounded-xl ${bodySize} min-h-[48px] flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer`}
        >
          <Plus className="w-4 h-4" />
          <span>Log Activity or Expense</span>
        </button>
      </div>
    </div>
  );
}
