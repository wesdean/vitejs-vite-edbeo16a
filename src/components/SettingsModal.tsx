import React from 'react';
import { X, Sliders, Eye, DollarSign, Zap } from 'lucide-react';
import type { UserPreferences } from '../config/appConfig';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

export default function SettingsModal({
  isOpen,
  onClose,
  preferences,
  setPreferences,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Added max-h-[85vh], overflow-y-auto, and flex flex-col to keep modal scrollable within viewport */}
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col p-6 border-2 border-stone-300 shadow-xl space-y-6">
        
        {/* Header - Fixed Header */}
        <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-stone-800" />
            <h2 className="text-lg font-bold text-stone-950">Personalize Your App</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 min-h-[48px] min-w-[48px] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto space-y-6 pr-1">
          <p className="text-xs text-stone-600">
            Customize display, accessibility features, and currency labels to match your exact workflow and sensory needs. Changes save automatically.
          </p>

          {/* Accessibility & Display Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Accessibility & Display</h3>
            
            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer min-h-[48px]">
              <span className="text-sm font-medium text-stone-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-stone-700" />
                High Contrast Borders & Text
              </span>
              <input
                type="checkbox"
                checked={preferences.highContrast}
                onChange={(e) =>
                  setPreferences((prev) => ({ ...prev, highContrast: e.target.checked }))
                }
                className="w-5 h-5 accent-stone-900 rounded"
              />
            </label>

            {/* Privacy & Data Hygiene Section (PII Toggle) */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer min-h-[48px]">
              <div className="flex flex-col pr-2">
                <span className="text-sm font-medium text-stone-900">
                  Auto-Mask Personal Info (PII)
                </span>
                <span className="text-xs text-stone-600">
                  Automatically redact phone numbers, emails, and SSNs in notes
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.maskPII ?? true}
                onChange={(e) =>
                  setPreferences((prev) => ({ ...prev, maskPII: e.target.checked }))
                }
                className="w-5 h-5 accent-stone-900 rounded shrink-0"
              />
            </label>

            {/* Text Size Selector */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <label className="text-sm font-medium text-stone-900 block">Text Size</label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'xlarge'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPreferences((prev) => ({ ...prev, fontSize: size }))}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold min-h-[48px] flex items-center justify-center transition-all ${
                      preferences.fontSize === size
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Currency & Unit Labels Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Custom Currency Labels</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Money Symbol
                </label>
                <input
                  type="text"
                  value={preferences.moneyCurrencySymbol}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, moneyCurrencySymbol: e.target.value }))
                  }
                  className="w-full px-3 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm bg-white min-h-[48px]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Energy Unit
                </label>
                <input
                  type="text"
                  value={preferences.energyUnitLabel}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, energyUnitLabel: e.target.value }))
                  }
                  className="w-full px-3 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm bg-white min-h-[48px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action - Fixed Bottom */}
        <div className="shrink-0 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-stone-900 hover:bg-stone-950 text-white font-medium py-3.5 rounded-xl text-sm min-h-[48px] transition-colors"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
}