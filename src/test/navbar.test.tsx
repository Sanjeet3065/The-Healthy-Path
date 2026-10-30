import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { ThemeProvider } from '../components/ThemeProvider';

describe('Navbar Mobile-First Responsive Behavior', () => {
  it('renders brand name and theme toggle', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <Navbar />
      </ThemeProvider>
    );

    expect(screen.getByText('The Healthy Path')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle navigation menu/i })).toBeInTheDocument();
  });

  it('toggles mobile menu drawer on hamburger click', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <Navbar />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(screen.queryByText('Route Planner & Highway Compare')).not.toBeInTheDocument();

    // Open mobile menu
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Route Planner & Highway Compare')).toBeInTheDocument();
    expect(screen.getByText('Live UP Air Quality (City Cards)')).toBeInTheDocument();
    expect(screen.getByText('Commuter Health & Smog Protection')).toBeInTheDocument();

    // Close mobile menu
    fireEvent.click(toggleBtn);
    expect(screen.queryByText('Route Planner & Highway Compare')).not.toBeInTheDocument();
  });
});
