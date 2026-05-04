import * as React from 'react';

export function useScrollSpy(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        // Don't update when scrolling between sections (nothing in range)
        if (intersecting.length === 0) return;
        // Pick the topmost visible section when multiple enter at once
        const top = intersecting.reduce((prev, curr) =>
          curr.boundingClientRect.top < prev.boundingClientRect.top
            ? curr
            : prev,
        );
        setActiveId(top.target.id);
      },
      // Tight window: only the top ~20% of the viewport triggers
      { rootMargin: '0px 0px -80% 0px', threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
