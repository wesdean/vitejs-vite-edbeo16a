import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import App from '../App';

describe('App Integration & Persistence Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to dashboard tab and persists active tab selection', () => {
    render(<App />);

    // Dashboard should be visible initially
    expect(screen.getByText('Pace & Purse')).toBeInTheDocument();

    // Click on Log tab in bottom navigation
    const logTabBtn = screen.getByText('Log').closest('button');
    expect(logTabBtn).toBeInTheDocument();

    if (logTabBtn) {
      fireEvent.click(logTabBtn);
    }

    // Verify LogView is rendered
    expect(screen.getByText('Activity & Expense Log')).toBeInTheDocument();

    // Verify active tab is saved to localStorage
    expect(localStorage.getItem('pace_purse_active_tab')).toBe('log');
  });

  it('restores active tab from localStorage on load', () => {
    localStorage.setItem('pace_purse_active_tab', 'log');

    render(<App />);

    // Should load directly into the Log tab
    expect(screen.getByText('Activity & Expense Log')).toBeInTheDocument();
  });
});
