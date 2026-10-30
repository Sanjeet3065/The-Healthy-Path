import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeroSection from '../components/HeroSection';

describe('HeroSection Heading Responsive Layout', () => {
  it('renders heading with mobile break and unbroken Uttar Pradesh phrase', () => {
    const { container } = render(<HeroSection />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-center');

    // First line span: Find the Cleanest Route Across
    const line1Span = heading.querySelector('span.block');
    expect(line1Span).not.toBeNull();
    expect(line1Span?.textContent).toBe('Find the Cleanest Route Across');
    expect(line1Span).toHaveClass('block', 'sm:inline');

    // Second line span: Uttar Pradesh
    const line2Span = heading.querySelector('span.whitespace-nowrap');
    expect(line2Span).not.toBeNull();
    expect(line2Span?.textContent).toBe('Uttar Pradesh');
    expect(line2Span).toHaveClass('inline-block', 'whitespace-nowrap');
  });
});
