import { render, screen, fireEvent } from '@testing-library/react';
import BottomNav from '../components/BottomNav';
import { describe, it, expect, vi } from 'vitest';

describe('BottomNav Component Regression Tests', () => {
  it('renders all navigation tabs', () => {
    const setActiveTab = vi.fn();

    render(<BottomNav activeTab="dashboard" setActiveTab={setActiveTab} />);

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Log')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  it('calls setActiveTab when a tab button is clicked', () => {
    const setActiveTab = vi.fn();

    render(<BottomNav activeTab="dashboard" setActiveTab={setActiveTab} />);

    const projectsButton = screen.getByText('Projects').closest('button');
    expect(projectsButton).toBeInTheDocument();

    if (projectsButton) {
      fireEvent.click(projectsButton);
    }

    expect(setActiveTab).toHaveBeenCalledWith('projects');
  });

  it('highlights the currently active tab', () => {
    const setActiveTab = vi.fn();

    render(<BottomNav activeTab="log" setActiveTab={setActiveTab} />);

    const logTab = screen.getByText('Log').closest('button');
    expect(logTab).toBeInTheDocument();
    expect(logTab).toHaveClass('text-stone-900', 'font-semibold');
  });
});
