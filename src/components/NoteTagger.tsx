import React, { useState, useRef, useEffect } from 'react';
import { Tag, Search, Plus, X, MessageSquare } from 'lucide-react';
import type { UserPreferences } from '../config/appConfig';

interface NoteTaggerProps {
  selectedTags: string[];
  onChangeTags: (tags: string[]) => void;
  comment: string;
  onChangeComment: (comment: string) => void;
  preferences: UserPreferences;
}

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

export default function NoteTagger({
  selectedTags,
  onChangeTags,
  comment,
  onChangeComment,
  preferences,
}: NoteTaggerProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const bodySize = preferences.fontSize === 'xlarge' ? 'text-base' : preferences.fontSize === 'large' ? 'text-sm' : 'text-xs';

  // Filter available tags that aren't already selected and match search query
  const filteredTags = COMMON_TAGS.filter(
    (tag) => !selectedTags.includes(tag) && tag.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChangeTags([...selectedTags, tag]);
    }
    setQuery('');
    setIsOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChangeTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      const customTag = query.trim().toLowerCase();
      addTag(customTag);
    }
  };

  return (
    <div className="space-y-4 bg-stone-50 p-4 rounded-2xl border border-stone-200" ref={containerRef}>
      
      {/* Header / Label */}
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-amber-800" />
        <label className={`${bodySize} font-bold text-stone-900`}>Notes & State Tags</label>
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 font-medium text-xs border border-amber-300 shadow-2xs"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-amber-200 p-0.5 rounded-full text-amber-900 min-h-[24px] min-w-[24px] flex items-center justify-center cursor-pointer"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Searchable Autocomplete Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search or add tag (e.g. poor sleep)..."
            className={`w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-950 placeholder:text-stone-400 ${bodySize} focus:outline-hidden focus:ring-2 focus:ring-amber-700 min-h-[48px]`}
          />
          {query.trim() && (
            <button
              type="button"
              onClick={() => addTag(query.trim().toLowerCase())}
              className="absolute right-2 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 flex items-center gap-1 cursor-pointer min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown Suggestions */}
        {isOpen && filteredTags.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-stone-300 shadow-lg max-h-48 overflow-y-auto p-1.5 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Common Quick Tags
            </div>
            {filteredTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-amber-50 hover:text-amber-950 text-stone-800 text-xs font-medium transition-colors flex items-center justify-between min-h-[44px] cursor-pointer"
              >
                <span>{tag}</span>
                <Plus className="w-3.5 h-3.5 text-stone-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comment Field */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
          <label className={`font-medium text-stone-700 text-xs`}>Additional Context / Comments</label>
        </div>
        <textarea
          value={comment}
          onChange={(e) => onChangeComment(e.target.value)}
          placeholder="Add any additional reflections or details..."
          rows={3}
          className={`w-full p-3 bg-white border border-stone-300 rounded-xl text-stone-950 placeholder:text-stone-400 ${bodySize} focus:outline-hidden focus:ring-2 focus:ring-amber-700 resize-none`}
        />
      </div>

    </div>
  );
}