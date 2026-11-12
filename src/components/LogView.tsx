import React, { useState } from 'react';
import { Zap, Tag, Clock, AlignLeft } from 'lucide-react';
import type { UserPreferences, EnergyLogEntry } from '../config/appConfig';
import type { FinancialLogEntry } from './LogView';

interface LogViewProps {
  energyLogs: EnergyLogEntry[];
  financialLogs?: FinancialLogEntry[];
  preferences: UserPreferences;
  onOpenCalibration?: () => void;
  onOpenFinancialEntry?: () => void;
}

type FilterType = 'all' | 'energy' | 'financial';

export default function LogView({
  energyLogs = [],
  financialLogs = [],
  preferences,
  onOpenCalibration,
  onOpenFinancialEntry,
}: LogViewProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const titleSize =
    preferences.fontSize === 'xlarge'
      ? 'text-2xl'
      : preferences.fontSize === 'large'
      ? 'text-xl'
      : 'text-lg';
  const bodySize =
    preferences.fontSize === 'xlarge'
      ? 'text-base'
      : preferences.fontSize === 'large'
      ? 'text-sm'
      : 'text-xs';
  const subSize =
    preferences.fontSize === 'xlarge'
      ? 'text-sm'
      : preferences.fontSize === 'large'
      ? 'text-xs'
      : 'text-[11px]';

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const combinedEntries = [
    ...energyLogs.map((item) => ({ ...item, entryType: 'energy' as const })),
    ...financialLogs.map((item) => ({
      ...item,
      entryType: 'financial' as const,
    })),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredEntries = combinedEntries.filter((item) => {
    if (filter === 'energy') return item.entryType === 'energy';
    if (filter === 'financial') return item.entryType === 'financial';
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Side-by-Side Action Buttons */}
      <div className="space-y-3">
        <div>
          <h1 className={`font-semibold ${titleSize} text-stone-950`}>
            Activity & Expense Log
          </h1>
          <p className={`${bodySize} text-stone-700`}>
            Review past energy calibrations and financial activity.
          </p>
        </div>

        {/* Two-Column Side-by-Side Buttons Row */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            type="button"
            onClick={onOpenCalibration}
            className="min-h-[48px] w-full bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300 rounded-xl font-semibold flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="New Energy Calibration"
          >
            <span className={bodySize}>New Energy Log</span>
          </button>

          <button
            type="button"
            disabled
            onClick={onOpenFinancialEntry}
            className="min-h-[48px] w-full bg-stone-100 text-stone-400 border-2 border-stone-200 rounded-xl font-medium flex items-center justify-center cursor-not-allowed opacity-75"
            aria-label="New Financial Entry (Coming Soon)"
            title="Financial entry feature coming soon"
          >
            <span className={bodySize}>New Financial Log</span>
          </button>
        </div>

        {/* Segmented Filter Control */}
        <div
          className="flex bg-stone-200/70 p-1 rounded-xl gap-1"
          aria-label="Log view filters"
        >
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`flex-1 min-h-[48px] rounded-lg ${bodySize} font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-stone-950 shadow-sm font-semibold'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('energy')}
            className={`flex-1 min-h-[48px] rounded-lg ${bodySize} font-medium transition-all flex items-center justify-center gap-1 ${
              filter === 'energy'
                ? 'bg-amber-100 text-amber-950 border border-amber-300 font-semibold'
                : 'text-stone-700 hover:text-amber-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-600" />
            Energy
          </button>
          <button
            type="button"
            onClick={() => setFilter('financial')}
            className={`flex-1 min-h-[48px] rounded-lg ${bodySize} font-medium transition-all flex items-center justify-center gap-1 ${
              filter === 'financial'
                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-semibold'
                : 'text-stone-700 hover:text-emerald-900'
            }`}
          >
            Money
          </button>
        </div>
      </div>

      {/* Entries Feed */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border-2 border-stone-200 text-center space-y-2">
          <p className={`${bodySize} text-stone-700 font-medium`}>
            No entries recorded yet.
          </p>
          <p className={`${subSize} text-stone-500`}>
            Calibrate your energy battery or record an expense to populate your
            log.
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-testid="log-entries-list">
          {filteredEntries.map((entry) => {
            if (entry.entryType === 'energy') {
              const energyItem = entry as EnergyLogEntry & {
                entryType: 'energy';
              };
              return (
                <article
                  key={energyItem.id}
                  className="bg-white rounded-2xl p-4 border-2 border-stone-200 shadow-sm space-y-3"
                  aria-label={`Energy entry: ${energyItem.tierLabel}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                        <Zap className="w-5 h-5 fill-amber-400 text-amber-600" />
                      </div>
                      <div>
                        <h2 className={`${bodySize} font-bold text-stone-950`}>
                          {energyItem.tierLabel || 'Energy Calibration'}
                        </h2>
                        <div
                          className={`flex items-center gap-1 ${subSize} text-stone-600`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(energyItem.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-lg text-amber-950 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {energyItem.level}
                      {preferences.energyUnitLabel}
                    </span>
                  </div>

                  {energyItem.tags && energyItem.tags.length > 0 && (
                    <div
                      className="flex flex-wrap gap-1.5 pt-1"
                      aria-label="Tags"
                    >
                      {energyItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-300 ${subSize}`}
                        >
                          <Tag className="w-3 h-3 text-stone-500" />
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  )}

                  {energyItem.note && (
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-start gap-2">
                      <AlignLeft className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                      <p
                        className={`${subSize} text-stone-800 leading-relaxed italic`}
                      >
                        "{energyItem.note}"
                      </p>
                    </div>
                  )}
                </article>
              );
            }

            const financialItem = entry as FinancialLogEntry & {
              entryType: 'financial';
            };
            return (
              <article
                key={financialItem.id}
                className="bg-white rounded-2xl p-4 border-2 border-stone-200 shadow-sm space-y-2"
                aria-label={`Financial entry: ${financialItem.description}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className={`${bodySize} font-bold text-stone-950`}>
                      {financialItem.description}
                    </h2>
                    <div
                      className={`flex items-center gap-1 ${subSize} text-stone-600`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(financialItem.timestamp)}</span>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {preferences.moneyCurrencySymbol}
                    {financialItem.amount.toFixed(2)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
