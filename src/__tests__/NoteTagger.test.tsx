import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NoteTagger from '../components/NoteTagger';
import { defaultPreferences } from '../config/appConfig';

describe('NoteTagger Component', () => {
  const defaultProps = {
    selectedTags: [],
    onChangeTags: vi.fn(),
    comment: '',
    onChangeComment: vi.fn(),
    preferences: defaultPreferences,
  };

  it('renders correctly with initial empty state', () => {
    render(<NoteTagger {...defaultProps} />);

    expect(screen.getByText('Notes & State Tags')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search or add tag \(e.g. poor sleep\)...?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /Add any additional reflections or details.../i
      )
    ).toBeInTheDocument();
  });

  it('displays selected tags as removable pills', () => {
    render(
      <NoteTagger
        {...defaultProps}
        selectedTags={['poor sleep', 'brain fog']}
      />
    );

    expect(screen.getByText('poor sleep')).toBeInTheDocument();
    expect(screen.getByText('brain fog')).toBeInTheDocument();
  });

  it('calls onChangeTags when a tag is removed', () => {
    const onChangeTags = vi.fn();
    render(
      <NoteTagger
        {...defaultProps}
        selectedTags={['poor sleep']}
        onChangeTags={onChangeTags}
      />
    );

    const removeButton = screen.getByRole('button', {
      name: /Remove tag poor sleep/i,
    });
    fireEvent.click(removeButton);

    expect(onChangeTags).toHaveBeenCalledWith([]);
  });

  it('shows autocomplete suggestions when typing in the search input', () => {
    render(<NoteTagger {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Search or add tag/i);
    fireEvent.change(input, { target: { value: 'sleep' } });
    fireEvent.focus(input);

    expect(screen.getByText('Common Quick Tags')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /poor sleep/i })
    ).toBeInTheDocument();
  });

  it('adds a custom tag when clicking the "Add" button', () => {
    const onChangeTags = vi.fn();
    render(
      <NoteTagger
        {...defaultProps}
        onChangeTags={onChangeTags}
        selectedTags={[]}
      />
    );

    const input = screen.getByPlaceholderText(/Search or add tag/i);
    fireEvent.change(input, { target: { value: 'custom energy drain' } });

    const addButton = screen.getByRole('button', { name: /^Add$/i });
    fireEvent.click(addButton);

    expect(onChangeTags).toHaveBeenCalledWith(['custom energy drain']);
  });

  it('adds a custom tag when pressing Enter', () => {
    const onChangeTags = vi.fn();
    render(
      <NoteTagger
        {...defaultProps}
        onChangeTags={onChangeTags}
        selectedTags={[]}
      />
    );

    const input = screen.getByPlaceholderText(/Search or add tag/i);
    fireEvent.change(input, { target: { value: 'caffeine crash' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onChangeTags).toHaveBeenCalledWith(['caffeine crash']);
  });

  it('calls onChangeComment when updating the comment field', () => {
    const onChangeComment = vi.fn();
    render(<NoteTagger {...defaultProps} onChangeComment={onChangeComment} />);

    const textarea = screen.getByPlaceholderText(
      /Add any additional reflections or details.../i
    );
    fireEvent.change(textarea, {
      target: { value: 'Feeling slightly better after resting.' },
    });

    expect(onChangeComment).toHaveBeenCalledWith(
      'Feeling slightly better after resting.'
    );
  });
});
