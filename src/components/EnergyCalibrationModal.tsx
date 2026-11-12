import React, { useState, useEffect, useRef } from 'react';
import { Zap, X, BatteryCharging, Info, Tag, Search, Plus, MessageSquare, ChevronDown, ChevronUp, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { UserPreferences } from '../config/appConfig';

interface EnergyCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newBatteryLevel: number, notes: { tags: string[]; comment: string }) => void;
  currentBattery: number;
  preferences: UserPreferences;
}

interface TierInfo {
  id: number;
  label: string;      // Emoticon
  name: string;       // Short name
  range: string;
  title: string;
  guidance: string;   // Gentle "Why?" Context
  min: number;
  max: number;
  defaultVal: number;
}

const TIERS: TierInfo[] = [
  { 
    id: 1, 
    label: '⚡', 
    name: 'Tier 1',
    range: '76–100%',
    title: 'Full capacity, clear focus, ready for high-demand tasks.',
    guidance: 'Best suited for deep work, complex problem-solving, or social engagement.',
    min: 76, 
    max: 100, 
    defaultVal: 88 
  },
  { 
    id: 2, 
    label: '🔋', 
    name: 'Tier 2',
    range: '51–75%',
    title: 'Functional but feeling the drag; standard workday pace.',
    guidance: 'Ideal for routine tasks, administrative work, with built-in rest intervals.',
    min: 51, 
    max: 75, 
    defaultVal: 63 
  },
  { 
    id: 3, 
    label: '🪫', 
    name: 'Tier 3',
    range: '26–50%',
    title: 'Operating on fumes; brain fog, heavy friction, sensory load.',
    guidance: 'Low-energy mode: focus only on essential self-care and gentle maintenance.',
    min: 26, 
    max: 50, 
    defaultVal: 38 
  },
  { 
    id: 4, 
    label: '🛑', 
    name: 'Tier 4',
    range: '0–25%',
    title: 'Total depletion; forced shutdown, calm nervous system recovery.',
    guidance: 'Rest imperative: pause all non-essential demands and prioritize calm.',
    min: 0, 
    max: 25, 
    defaultVal: 12 
  },
];

const PRESETS = [
  { label: 'Woke up exhausted', value: 15, tierId: 4, tags: ['poor sleep', 'brain fog'] },
  { label: 'Post-crash recovery', value: 35, tierId: 3, tags: ['sensory overload'] },
  { label: 'Normal baseline', value: 70, tierId: 2, tags: [] },
];

const COMMON_TAGS = [
  'poor sleep',
  'racing heartbeat',
  'heavy physical exertion',
  'brain fog',
  'sensory overload',
  'high anxiety',
  'pain flare',
  'caffeine spike',
  'late night',
];

export default function EnergyCalibrationModal({
  isOpen,
  onClose,
  onSave,
  currentBattery,
  preferences,
}: EnergyCalibrationModalProps) {
  const [batteryValue, setBatteryValue] = useState(currentBattery);
  const [selectedTierId, setSelectedTierId] = useState<number>(() => {
    const found = TIERS.find(t => currentBattery >= t.min && currentBattery <= t.max);
    return found ? found.id : 1;
  });

  // Notes & Tagger State
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [tagQuery, setTagQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setBatteryValue(currentBattery);
      const found = TIERS.find(t => currentBattery >= t.min && currentBattery <= t.max);
      setSelectedTierId(found ? found.id : 1);
      setSelectedTags([]);
      setComment('');
      setIsNotesOpen(false);
    }
  }, [isOpen, currentBattery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagContainerRef.current && !tagContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const titleSize = preferences.fontSize === 'xlarge' ? 'text-2xl' : preferences.fontSize === 'large' ? 'text-xl' : 'text-lg';
  const bodySize = preferences.fontSize === 'xlarge' ? 'text-base' : preferences.fontSize === 'large' ? 'text-sm' : 'text-xs';

  const activeTier = TIERS.find(t => t.id === selectedTierId) || TIERS[0];

  // Calculate Energy Trend vs currentBattery baseline
  const diff = batteryValue - currentBattery;
  const trendLabel = 
    diff > 3 ? '↗️ Up from baseline' :
    diff < -3 ? '↘️ Lower than baseline' : '➡️ Steady state';

  const handleSelectTier = (tier: TierInfo) => {
    setSelectedTierId(tier.id);
    setBatteryValue(tier.defaultVal);
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setBatteryValue(preset.value);
    setSelectedTierId(preset.tierId);
    if (preset.tags.length > 0) {
      setSelectedTags(Array.from(new Set([...selectedTags, ...preset.tags])));
    }
  };

  const handleMainSliderChange = (newVal: number) => {
    setBatteryValue(newVal);
    const found = TIERS.find(t => newVal >= t.min && newVal <= t.max);
    if (found) {
      setSelectedTierId(found.id);
    }
  };

  const handleOffsetSliderChange = (newVal: number) => {
    const clampedVal = Math.max(activeTier.min, Math.min(activeTier.max, newVal));
    setBatteryValue(clampedVal);
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagQuery('');
    setIsDropdownOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
  };

  const filteredTags = COMMON_TAGS.filter(
    t => !selectedTags.includes(t) && t.toLowerCase().includes(tagQuery.toLowerCase())
  );

  const handleSave = () => {
    onSave(batteryValue, { tags: selectedTags, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 border-2 border-stone-300 shadow-xl space-y-5 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-950 flex items-center justify-center shadow-2xs shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-bold ${titleSize} text-stone-950`}>Energy Calibration</h2>
              <p className={`${bodySize} text-stone-700`}>Select your operational capacity tier</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick-Save Presets ("One-Tap" Routines for Executive Fatigue) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span>Quick-Save Routines</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="p-2 rounded-xl bg-stone-50 border border-stone-200 hover:bg-amber-50 hover:border-amber-300 text-stone-800 hover:text-amber-950 text-[11px] font-medium transition-colors text-center cursor-pointer min-h-[42px] flex items-center justify-center"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Battery Projection Banner with Trend Indicator & Manual Slider */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <BatteryCharging className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">Projected Capacity</span>
                <span className="text-xs text-amber-800 font-medium">{trendLabel}</span>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-950 flex items-center gap-1">
              {batteryValue}{preferences.energyUnitLabel}
            </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={batteryValue}
            onChange={(e) => handleMainSliderChange(Number(e.target.value))}
            className="w-full accent-amber-700 h-2 bg-stone-200 rounded-lg cursor-pointer my-2"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-medium">
            <span>0% (Depleted)</span>
            <span>100% (Full)</span>
          </div>
        </div>

        {/* Square 2x2 Emoticon Tier Selection Grid */}
        <div className="space-y-2.5">
          <label className={`${bodySize} font-medium text-stone-800 block`}>Capacity Tiers</label>
          <div className="grid grid-cols-2 gap-3">
            {TIERS.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => handleSelectTier(tier)}
                  className={`aspect-square p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-800 bg-amber-50 text-amber-950 shadow-xs ring-1 ring-amber-800/30'
                      : 'border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <span className="text-2xl mb-1.5">{tier.label}</span>
                  <span className="text-xs font-bold text-stone-900 mb-0.5">{tier.name}</span>
                  <span className="text-[10px] text-stone-600 font-medium">{tier.range}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gentle "Why?" Context / Impact Preview & Active Tier Definition */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Active Tier Guidance ({activeTier.name})</span>
            <p className={`${bodySize} text-stone-900 leading-relaxed font-medium`}>
              {activeTier.guidance}
            </p>
          </div>
        </div>

        {/* Offset Slider Section */}
        <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <div className="flex justify-between items-center">
            <span className={`${bodySize} font-medium text-stone-800`}>Tier Offset Slider ({activeTier.range})</span>
            <span className="font-bold text-xs text-amber-950">{batteryValue}{preferences.energyUnitLabel}</span>
          </div>
          <input 
            type="range" 
            min={activeTier.min} 
            max={activeTier.max} 
            value={batteryValue}
            onChange={(e) => handleOffsetSliderChange(Number(e.target.value))}
            className="w-full accent-amber-700 h-2 bg-stone-200 rounded-lg cursor-pointer my-2"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-medium">
            <span>{activeTier.min}% ({activeTier.name} Min)</span>
            <span>{activeTier.max}% ({activeTier.name} Max)</span>
          </div>
        </div>

        {/* Collapsible Notes & State Tags Section */}
        <div className="border border-stone-200 rounded-2xl bg-stone-50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-100/80 transition-colors cursor-pointer min-h-[48px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <span className={`${bodySize} font-semibold text-stone-900`}>
                {selectedTags.length > 0 || comment ? 'Notes & Tags Added' : 'Add notes, tags, or reflections...'}
              </span>
            </div>
            {isNotesOpen ? <ChevronUp className="w-4 h-4 text-stone-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-600 shrink-0" />}
          </button>

          {isNotesOpen && (
            <div className="p-4 pt-1 space-y-4 animate-fadeIn" ref={tagContainerRef}>
              
              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 font-medium text-xs border border-amber-300 shadow-2xs"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-amber-200 p-0.5 rounded-full text-amber-900 cursor-pointer min-h-[20px] min-w-[20px] flex items-center justify-center"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Searchable Autocomplete Field */}
              <div className="relative pt-1">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-4 h-4 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    value={tagQuery}
                    onChange={(e) => {
                      setTagQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search or add tag (e.g. poor sleep)..."
                    className={`w-full pl-11 pr-16 py-3 bg-white border border-stone-300 rounded-xl text-stone-950 placeholder:text-stone-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-700 min-h-[48px] shadow-2xs`}
                  />
                  {tagQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => addTag(tagQuery.trim().toLowerCase())}
                      className="absolute right-2 px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 flex items-center gap-1 cursor-pointer min-h-[36px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown */}
                {isDropdownOpen && filteredTags.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-stone-300 shadow-lg max-h-48 overflow-y-auto p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      Common Quick Tags
                    </div>
                    {filteredTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-amber-50 hover:text-amber-950 text-stone-800 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer min-h-[44px]"
                      >
                        <span>{tag}</span>
                        <Plus className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Comment Field */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <label className="font-medium text-stone-800 text-xs">Additional Reflections / Notes</label>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How are you experiencing this energy state right now?"
                  rows={3}
                  className="w-full p-3.5 bg-white border border-stone-300 rounded-xl text-stone-950 placeholder:text-stone-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-700 resize-none shadow-2xs leading-relaxed"
                />
              </div>

            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3">
          <button 
            onClick={onClose}
            className={`flex-1 py-3.5 px-4 rounded-xl font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 ${bodySize} min-h-[48px] transition-colors cursor-pointer`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className={`flex-1 py-3.5 px-4 rounded-xl font-medium bg-stone-950 hover:bg-stone-900 text-white ${bodySize} min-h-[48px] flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer`}
          >
            <BatteryCharging className="w-4 h-4" />
            <span>Update Battery</span>
          </button>
        </div>

      </div>
    </div>
  );
}