import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LogView from '../components/LogView';
import type { UserPreferences, EnergyLogEntry } from '../config/appConfig';
import type { FinancialLogEntry } from '../components/LogView';

const mockPreferences: UserPreferences = {
  themeMode: 'stone',
  fontSize: 'normal',
  highContrast: false,
  moneyCurrencySymbol: '$',
  energyUnitLabel: '%',
};

const mockEnergyLogs: EnergyLogEntry[] = [
  {
    id: 'e-1',
    timestamp: '2026-11-10T10:00:00.000Z',
    level: 75,
    tierLabel: 'Steady Energy',
    tags: ['sleep'],
    note: 'Felt well-rested.',
  },
];

const mockFinancialLogs: FinancialLogEntry[] = [
  {
    id: 'f-1',
    timestamp: '2026-11-10T12:00:00.000Z',
    amount: 25.50,
    description: 'Groceries',
  },
];

describe('LogView Component Coverage Extensions', () => {
  it('renders both energy and financial logs and supports filtering', () => {
    render(
      <LogView
        energyLogs={mockEnergyLogs}
        financialLogs={mockFinancialLogs}
        preferences={mockPreferences}
      />
    );

    // Verify both items show initially ('All' filter)
    expect(screen.getByText('Steady Energy')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('$25.50')).toBeInTheDocument();

    // Click 'Energy' filter
    const energyFilterBtn = screen.getByRole('button', { name: /^Energy$/i });
    fireEvent.click(energyFilterBtn);
    expect(screen.getByText('Steady Energy')).toBeInTheDocument();
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument();

    // Click 'Money' filter
    const moneyFilterBtn = screen.getByRole('button', { name: /^Money$/i });
    fireEvent.click(moneyFilterBtn);
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.queryByText('Steady Energy')).not.toBeInTheDocument();
  });
});