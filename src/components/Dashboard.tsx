import React from 'react';
import { DollarSign, Zap, Plus, Sparkles } from 'lucide-react';
import { appConfig } from '../config/appConfig';

interface DashboardProps {
  moneyBalance: number;
  energyBattery: number;
  currencySymbol: string;
  energyUnit: string;
  onOpenCalibrate: () => void;
  onNavigateLog: () => void;
}

export default function Dashboard({
  moneyBalance,
  energyBattery,
  currencySymbol,
  energyUnit,
  onOpenCalibrate,
  onNavigateLog,
}: DashboardProps) {
  const clampedBattery = Math.max(0, Math.min(100, energyBattery));

  const getAmbientInsight = () => {
    if (clampedBattery >= 70) {
      return `Energy is at ${clampedBattery}${energyUnit}. Great window for high-focus task planning before scheduling financial commitments.`;
    }
    if (clampedBattery >= 40) {
      return `Energy is steady at ${clampedBattery}${energyUnit}. Pace heavier decisions and leave buffer time between tasks.`;
    }
    return `Energy is running low at ${clampedBattery}${energyUnit}. Prioritize rest and delay non-essential spending or complex choices.`;
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-950 tracking-tight">
            {appConfig.name}
          </h1>
          <p className="text-xs font-medium text-stone-700">
            {appConfig.tagline}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCalibrate}
          className="px-4 py-3 rounded-2xl bg-stone-200/80 hover:bg-stone-300/80 text-stone-950 text-xs font-semibold min-h-[48px] min-w-[48px] transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-offset-2"
        >
          Calibrate Energy
        </button>
      </div>

      {/* Dual-Currency Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Financial Card */}
        <div className="bg-white rounded-3xl p-4 border-2 border-stone-300/85 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">
              Financial
            </span>
            <span
              aria-hidden="true"
              className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-center"
            >
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold text-stone-950 tracking-tight">
              {currencySymbol}
              {moneyBalance.toLocaleString()}
            </div>
            <p className="text-xs font-medium text-emerald-950 mt-1">
              Available balance
            </p>
          </div>
        </div>

        {/* Operational Energy Battery Card */}
        <div className="bg-white rounded-3xl p-4 border-2 border-stone-300/85 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">
              Battery
            </span>
            <span
              aria-hidden="true"
              className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center justify-center"
            >
              <Zap className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-stone-950 tracking-tight">
              {energyBattery}
              {energyUnit}
            </div>

            <div
              role="progressbar"
              aria-label="Operational energy battery level"
              aria-valuenow={clampedBattery}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden"
            >
              <div
                className="h-full rounded-full bg-amber-600 transition-all duration-300"
                style={{ width: `${clampedBattery}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Insight Card */}
      <div
        role="region"
        aria-label="Ambient Insight"
        className="rounded-3xl p-4 bg-amber-50/90 border-2 border-amber-300 text-amber-950 space-y-1.5"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Ambient Insight</span>
        </div>
        <p className="text-sm leading-relaxed text-stone-950">
          {getAmbientInsight()}
        </p>
      </div>

      {/* Primary Action Button -> Triggers Energy Calibration Modal */}
      <button
        type="button"
        onClick={onOpenCalibrate}
        className="w-full bg-stone-950 hover:bg-stone-900 text-white font-semibold py-3.5 px-4 rounded-2xl min-h-[48px] flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-offset-2"
      >
        <Plus className="w-5 h-5" aria-hidden="true" />
        <span>Log Activity or Expense</span>
      </button>
    </div>
  );
}