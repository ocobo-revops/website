// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Reveal } from './reveal';

describe('Reveal', () => {
  it('renders the revealed state on the server', () => {
    const html = renderToString(<Reveal>Contenu</Reveal>);

    expect(html).toContain('data-state="visible"');
    expect(html).toContain('Contenu');
  });
});
