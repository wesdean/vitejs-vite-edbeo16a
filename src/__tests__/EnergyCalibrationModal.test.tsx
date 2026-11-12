import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EnergyCalibrationModal from '../components/EnergyCalibrationModal';
import { defaultPreferences } from '../config/appConfig';

describe('EnergyCalibrationModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    currentBattery: 65,
    preferences: defaultPreferences,
  };

  it('renders correctly when open', () => {
    render(<EnergyCalibrationModal {...defaultProps} />);

    expect(screen.getByText('Energy Calibration')).toBeInTheDocument();
    expect(
      screen.getByText('Select your operational capacity tier')
    ).toBeInTheDocument();
    expect(screen.getByText('Capacity Tiers')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <EnergyCalibrationModal {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('selects preset routines correctly and updates projected capacity', () => {
    render(<EnergyCalibrationModal {...defaultProps} />);

    const presetButton = screen.getByRole('button', {
      name: /woke up exhausted/i,
    });
    fireEvent.click(presetButton);

    // Woke up exhausted preset sets battery to 15% (Tier 4)
    // getAllByText handles multiple matching elements (banner + slider label)
    const matches = screen.getAllByText('15%');
    expect(matches.length).toBeGreaterThan(0);
    expect(screen.getByText(/Rest imperative/i)).toBeInTheDocument();
  });

  it('allows clicking capacity tiers to update battery and active guidance', () => {
    render(<EnergyCalibrationModal {...defaultProps} />);

    const tier1Button = screen.getByRole('button', { name: /Tier 1 76–100%/i });
    fireEvent.click(tier1Button);

    const matches = screen.getAllByText('88%');
    expect(matches.length).toBeGreaterThan(0);
    expect(screen.getByText(/Best suited for deep work/i)).toBeInTheDocument();
  });

  it('toggles the collapsible notes and tags section', () => {
    render(<EnergyCalibrationModal {...defaultProps} />);

    const toggleButton = screen.getByRole('button', {
      name: /Add notes, tags, or reflections.../i,
    });
    fireEvent.click(toggleButton);

    expect(
      screen.getByPlaceholderText(/Search or add tag \(e.g. poor sleep\)...?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /How are you experiencing this energy state right now\?/i
      )
    ).toBeInTheDocument();
  });

  it('adds and removes tags correctly', () => {
    render(<EnergyCalibrationModal {...defaultProps} />);

    // Open notes section
    fireEvent.click(
      screen.getByRole('button', {
        name: /Add notes, tags, or reflections.../i,
      })
    );

    const searchInput = screen.getByPlaceholderText(/Search or add tag/i);
    fireEvent.change(searchInput, { target: { value: 'poor sleep' } });

    // Click quick tag suggestion
    const tagSuggestion = screen.getByRole('button', { name: /poor sleep/i });
    fireEvent.click(tagSuggestion);

    // Verify tag pill is displayed
    expect(screen.getByText('poor sleep')).toBeInTheDocument();

    // Remove tag
    const removeButton = screen.getByRole('button', {
      name: /Remove tag poor sleep/i,
    });
    fireEvent.click(removeButton);

    expect(screen.queryByText('poor sleep')).not.toBeInTheDocument();
  });

  it('calls onSave with battery value and notes when updating battery', () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <EnergyCalibrationModal
        {...defaultProps}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    const updateButton = screen.getByRole('button', {
      name: /Update Battery/i,
    });
    fireEvent.click(updateButton);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(65, { tags: [], comment: '' });
  });

  it('calls onClose when cancel button or close icon is clicked', () => {
    const handleClose = vi.fn();
    render(<EnergyCalibrationModal {...defaultProps} onClose={handleClose} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
