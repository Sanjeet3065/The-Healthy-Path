import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

function TestConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
      <ThemeToggle />
    </div>
  );
}

describe('Theme System (Light/Dark Mode)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    cleanup();
  });

  it('renders with default theme and sets root document element class', async () => {
    await act(async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestConsumer />
        </ThemeProvider>
      );
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('switches to dark theme when triggered and updates document root', async () => {
    await act(async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestConsumer />
        </ThemeProvider>
      );
    });

    const darkBtn = screen.getByText('Set Dark');
    await act(async () => {
      fireEvent.click(darkBtn);
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('the-healthy-path-theme')).toBe('dark');
  });

  it('toggles theme when clicking the ThemeToggle button', async () => {
    await act(async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestConsumer />
        </ThemeProvider>
      );
    });

    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    await act(async () => {
      fireEvent.click(toggleBtn);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
  });
});
