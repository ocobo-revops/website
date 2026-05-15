// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { OptimizedImage } from './optimized-image';

const base = {
  src: '/img/hero.jpg',
  alt: 'hero image',
  width: 600,
  height: 400,
} as const;

describe('OptimizedImage', () => {
  it('renders an <img> with src, alt, width, height', () => {
    render(<OptimizedImage {...base} />);
    const img = screen.getByRole('img', { name: 'hero image' });
    expect(img).toHaveAttribute('src', '/img/hero.jpg');
    expect(img).toHaveAttribute('width', '600');
    expect(img).toHaveAttribute('height', '400');
  });

  describe('non-priority (default)', () => {
    it('sets loading=lazy and decoding=async', () => {
      render(<OptimizedImage {...base} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('decoding', 'async');
    });

    it('does not set fetchpriority', () => {
      render(<OptimizedImage {...base} />);
      expect(screen.getByRole('img')).not.toHaveAttribute('fetchpriority');
    });
  });

  describe('priority', () => {
    it('sets loading=eager', () => {
      render(<OptimizedImage {...base} priority />);
      expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
    });

    it('sets fetchpriority=high', () => {
      render(<OptimizedImage {...base} priority />);
      // HTML attribute is lowercase regardless of JSX prop casing
      expect(screen.getByRole('img')).toHaveAttribute('fetchpriority', 'high');
    });

    it('does not set decoding attribute', () => {
      render(<OptimizedImage {...base} priority />);
      expect(screen.getByRole('img')).not.toHaveAttribute('decoding');
    });
  });

  it('forwards className to the <img>', () => {
    render(<OptimizedImage {...base} className="my-class" />);
    expect(screen.getByRole('img')).toHaveClass('my-class');
  });

  it('forwards onError handler to the <img>', async () => {
    const onError = vi.fn();
    render(<OptimizedImage {...base} onError={onError} />);
    const img = screen.getByRole('img');
    img.dispatchEvent(new Event('error'));
    expect(onError).toHaveBeenCalledTimes(1);
  });

  describe('SSR output', () => {
    it('emits fetchPriority=high and loading=eager in SSR HTML when priority', () => {
      const html = renderToString(<OptimizedImage {...base} priority />);
      // React 18.3 preserves camelCase in SSR output; browsers read it case-insensitively
      expect(html).toContain('fetchPriority="high"');
      expect(html).toContain('loading="eager"');
    });

    it('emits loading=lazy and decoding=async in SSR HTML by default', () => {
      const html = renderToString(<OptimizedImage {...base} />);
      expect(html).toContain('loading="lazy"');
      expect(html).toContain('decoding="async"');
    });
  });
});
