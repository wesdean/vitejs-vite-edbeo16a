import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import { defaultPreferences } from '../config/appConfig';
import { describe, it, expect } from 'vitest';

describe('Dashboard Component Regression Tests', () => {
  it('renders money balance and energy battery with correct default units', () => {
    render(
      <Dashboard
        moneyBalance={2450}
        energyBattery={72}
        preferences={defaultPreferences}
      />
    );

    // Verify app name and tagline from config are present
    expect(screen.getByText('Pace & Purse')).toBeInTheDocument();
    expect(screen.getByText('Dual-Currency Balance')).toBeInTheDocument();

    // Verify financial and battery values are displayed
    expect(screen.getByText('$2,450')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('respects custom currency symbols from user preferences', () => {
    const customPrefs = {
      ...defaultPreferences,
      moneyCurrencySymbol: '€',
      energyUnitLabel: 'pts',
    };

    render(
      <Dashboard
        moneyBalance={1500}
        energyBattery={85}
        preferences={customPrefs}
      />
    );

    // Check if custom currency symbol and energy units are rendered properly together
    expect(screen.getByText('€1,500')).toBeInTheDocument();
    expect(screen.getByText('85pts')).toBeInTheDocument();
  });
});
