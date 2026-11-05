/**
 * @vitest-environment jsdom
 */
import { createInstance } from 'i18next';
import { describe, expect, it } from 'vitest';

import { languages, resources } from '~/localization/resources';
import {
  STACK_LAYER_IDS,
  layerNumber,
  revenueStack,
} from '~/modules/revenue-stack';
import { axe, render, screen, within } from '~/test/utils';

import { StackDiagram } from './stack-diagram';

function headings() {
  return screen
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent);
}

describe('StackDiagram', () => {
  it('reads signals, the CRM, then context before interface (prototype#26)', () => {
    render(<StackDiagram />, { i18nLang: 'fr' });

    // The CRM is a paragraph: its `display-lg` size is H2 (ADR 0002).
    expect(headings()).toEqual([
      '01 · Signaux Ce qui entre',
      '02 · Contexte Ce qui donne du sens',
      '03 · Interface Des agents qui lisent et écrivent dans le CRM',
      '04 · Exécution Les outils métier, branchés au CRM',
    ]);
    expect(screen.getByText('CRM')).toBeInTheDocument();
  });

  it('numbers the layers from their place in STACK_LAYER_IDS', () => {
    expect(STACK_LAYER_IDS.map(layerNumber)).toEqual(['01', '02', '03', '04']);
  });

  it('renders the English copy', () => {
    render(<StackDiagram />, { i18nLang: 'en' });

    expect(
      screen.getByRole('figure', { name: /Ocobo's Revenue Systems stack/ }),
    ).toBeInTheDocument();
    expect(headings()[0]).toBe('01 · Signals What comes in');
    expect(screen.getByText('System of record')).toBeInTheDocument();
    expect(screen.getByText('Messaging')).toBeInTheDocument();
  });

  it('names the CRM editors and falls back to a letter without a logo', () => {
    render(<StackDiagram />, { i18nLang: 'fr' });

    expect(screen.getByRole('img', { name: 'HubSpot' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Salesforce' })).toBeInTheDocument();
    const claap = screen.getByText('Claap').closest('li');
    expect(claap).not.toBeNull();
    expect(within(claap as HTMLElement).getByText('C')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<StackDiagram />, { i18nLang: 'fr' });
    expect(await axe(container)).toHaveNoViolations();
  });
});

const NS = 'stack';

const stackKeys = [
  'figureLabel',
  'crm.label',
  'crm.title',
  'crm.text',
  ...STACK_LAYER_IDS.flatMap((id) => [
    `layers.${id}.label`,
    `layers.${id}.title`,
    // `RowCard` shows no text for execution.
    ...(id === 'execution' ? [] : [`layers.${id}.text`]),
  ]),
  ...STACK_LAYER_IDS.flatMap((id) => revenueStack.layers[id].tools).flatMap(
    (tool) => (tool.role ? [`roles.${tool.role}`] : []),
  ),
];

const translators = languages.map((lng) => {
  const i18n = createInstance();
  i18n.init({ lng, resources, initAsync: false });
  return [lng, i18n.getFixedT(lng, NS)] as const;
});

describe('stack copy', () => {
  it.each(translators)('resolves every key in %s', (_lng, t) => {
    for (const key of stackKeys) {
      expect(t(key), key).not.toBe(key);
      expect(t(key).trim(), key).not.toBe('');
    }
  });
});
