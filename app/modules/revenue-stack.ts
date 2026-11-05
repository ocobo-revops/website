/**
 * Ocobo's Revenue Systems stack: the CRM at the centre and four layers
 * around it. Single source of the stack diagram, read by the Revenue Systems
 * challenge page (#238), the technology page (#246) and the home.
 *
 * Tool names are brand names and stay as they are in every language. Every
 * other text lives in `locales/<lang>/stack.json`, under the layer id and the
 * tool `role` key.
 */

/** The four layers, in the order of their numbers. */
export const STACK_LAYER_IDS = [
  'signals',
  'context',
  'interface',
  'execution',
] as const;

export type StackLayerId = (typeof STACK_LAYER_IDS)[number];

export type StackTool = {
  name: string;
  /** Path under `public/`. Without one, the chip shows the first letter. */
  logo?: string;
  /** Key of the tool's role in `stack.json` (`roles.<key>`), list layers only. */
  role?: StackToolRole;
};

export type StackToolRole =
  | 'conversations'
  | 'calls'
  | 'enrichment'
  | 'contacts'
  | 'sequences'
  | 'agents'
  | 'assistant'
  | 'messaging';

/** Colour of the layer's dot. Interface is AI content: the AI gradient. */
export type StackAccent = 'mint' | 'sky' | 'ai' | 'coral';

export type StackLayer = {
  id: StackLayerId;
  accent: StackAccent;
  /** Shown before the layer name, as in "01 · Signaux". */
  number: string;
  tools: readonly StackTool[];
};

export type RevenueStack = {
  /** The CRM editors shown in the centre block. */
  crm: readonly StackTool[];
  layers: Record<StackLayerId, StackLayer>;
};

export const revenueStack: RevenueStack = {
  crm: [
    { name: 'HubSpot', logo: '/logos/hubspot.png' },
    { name: 'Salesforce', logo: '/logos/salesforce.png' },
  ],
  layers: {
    signals: {
      id: 'signals',
      accent: 'mint',
      number: '01',
      tools: [
        { name: 'Modjo', logo: '/logos/modjo.jpg', role: 'conversations' },
        { name: 'Aircall', logo: '/logos/aircall.png', role: 'calls' },
        { name: 'Clay', logo: '/logos/clay.png', role: 'enrichment' },
        {
          name: 'FullEnrich',
          logo: '/logos/full-enrich.svg',
          role: 'contacts',
        },
        { name: 'lemlist', logo: '/logos/lemlist.png', role: 'sequences' },
      ],
    },
    context: {
      id: 'context',
      accent: 'sky',
      number: '02',
      tools: [
        { name: 'Notion', logo: '/logos/notion.png' },
        { name: 'Modjo', logo: '/logos/modjo.jpg' },
        { name: 'Claap' },
        { name: 'Zendesk', logo: '/logos/zendesk.png' },
        { name: 'Intercom' },
      ],
    },
    interface: {
      id: 'interface',
      accent: 'ai',
      number: '03',
      tools: [
        { name: 'Dust', logo: '/logos/dust.png', role: 'agents' },
        { name: 'Claude', role: 'assistant' },
        { name: 'Slack', role: 'messaging' },
      ],
    },
    execution: {
      id: 'execution',
      accent: 'coral',
      number: '04',
      tools: [
        { name: 'Planhat', logo: '/logos/planhat.png' },
        { name: 'Qobra', logo: '/logos/qobra.png' },
        { name: 'Hyperline', logo: '/logos/hyperline.png' },
        { name: 'Metabase' },
      ],
    },
  },
};
