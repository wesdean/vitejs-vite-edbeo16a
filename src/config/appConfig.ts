export interface UserPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  moneyCurrencySymbol: string;
  energyUnitLabel: string;
  maskPII: boolean;
}

export const defaultPreferences: UserPreferences = {
  highContrast: false,
  reducedMotion: false,
  fontSize: 'normal',
  moneyCurrencySymbol: '$',
  energyUnitLabel: '%',
  maskPII: true,
};

export const appConfig = {
  name: "Pace & Purse",
  tagline: "Dual-Currency Balance",
  version: "1.0.0",

  accessibility: {
    touchTarget: "min-h-[48px] min-w-[48px] px-4 py-3",
    focusRing: "focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-offset-2",
  },

  nav: {
    dashboard: "Today",
    projects: "Projects",
    log: "Log",
    insights: "Insights",
  },
};