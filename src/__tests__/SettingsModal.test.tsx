import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SettingsModal from '../components/SettingsModal';
import { defaultPreferences } from '../config/appConfig';

describe('SettingsModal Component Complete Coverage', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    preferences: defaultPreferences,
    setPreferences: vi.fn(),
  };

  it('renders all preference options and sections', () => {
    render(<SettingsModal {...defaultProps} />);

    expect(screen.getByText('Personalize Your App')).toBeInTheDocument();
    expect(screen.getByText('Accessibility & Display')).toBeInTheDocument();
    expect(screen.getByText('Custom Currency Labels')).toBeInTheDocument();
    expect(
      screen.getByText('High Contrast Borders & Text')
    ).toBeInTheDocument();
    expect(screen.getByText('Text Size')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <SettingsModal {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('tackles text size selector buttons (Normal, Large, Xlarge)', () => {
    const setPreferences = vi.fn();
    render(<SettingsModal {...defaultProps} setPreferences={setPreferences} />);

    const normalBtn = screen.getByRole('button', { name: /^Normal$/ });
    const largeBtn = screen.getByRole('button', { name: /^Large$/ });
    const xlargeBtn = screen.getByRole('button', { name: /^Xlarge$/ });

    fireEvent.click(largeBtn);
    expect(setPreferences).toHaveBeenCalled();

    fireEvent.click(xlargeBtn);
    expect(setPreferences).toHaveBeenCalled();

    fireEvent.click(normalBtn);
    expect(setPreferences).toHaveBeenCalled();
  });

  it('toggles high contrast mode correctly', () => {
    const setPreferences = vi.fn();
    render(<SettingsModal {...defaultProps} setPreferences={setPreferences} />);

    const contrastCheckbox = screen.getByRole('checkbox', {
      name: /High Contrast Borders & Text/i,
    });
    fireEvent.click(contrastCheckbox);

    expect(setPreferences).toHaveBeenCalled();
  });

  it('allows editing money symbol and energy unit labels', () => {
    const setPreferences = vi.fn();
    render(<SettingsModal {...defaultProps} setPreferences={setPreferences} />);

    const currencyInput = screen.getByDisplayValue('$');
    fireEvent.change(currencyInput, { target: { value: '€' } });
    expect(setPreferences).toHaveBeenCalled();

    const energyInput = screen.getByDisplayValue('%');
    fireEvent.change(energyInput, { target: { value: 'pts' } });
    expect(setPreferences).toHaveBeenCalled();
  });

  it('calls onClose when close icon or save button is clicked', () => {
    const handleClose = vi.fn();
    render(<SettingsModal {...defaultProps} onClose={handleClose} />);

    const saveButton = screen.getByRole('button', { name: /Save & Close/i });
    fireEvent.click(saveButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const closeIconButton = screen.getByRole('button', {
      name: /Close settings/i,
    });
    fireEvent.click(closeIconButton);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
