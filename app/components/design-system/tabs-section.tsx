import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { type TabItem, Tabs } from '~/components/ui/tabs';

import { ShowcaseSection } from './showcase-section';

const caption = css({ fontSize: 'caption', color: 'gray', mb: '6' });
const demoTitle = cx(text({ variant: 'label' }), css({ mt: '10', mb: '4' }));
const time = css({ display: 'block', fontWeight: 'bold' });
const panel = css({ p: '6', bg: 'gray.light', rounded: '2xl' });

const day = [
  ['cibler', '08:30', 'Cibler', 'Les bons comptes, priorisés avant le café.'],
  [
    'preparer',
    '09:45',
    'Préparer',
    'Un brief de rendez-vous prêt en une minute.',
  ],
  ['capter', '11:10', 'Capter', 'Le compte rendu d’appel remplit le CRM.'],
  ['piloter', '17:30', 'Piloter', 'La revue de pipe arrive toute seule.'],
] as const;

const dayItems: TabItem[] = day.map(([value, hour, label, body]) => ({
  value,
  label: (
    <>
      <span className={time}>{hour}</span>
      {label}
    </>
  ),
  content: (
    <div className={panel}>
      <p className={text({ variant: 'display-md-bold' })}>{label}</p>
      <p className={cx(text({ variant: 'body' }), css({ mt: '2' }))}>{body}</p>
    </div>
  ),
}));

const simpleItems: TabItem[] = [
  { value: 'audit', label: 'Audit', content: <p>Le diagnostic de départ.</p> },
  { value: 'build', label: 'Build', content: <p>La mise en place.</p> },
  { value: 'run', label: 'Run', content: <p>Le pilotage dans la durée.</p> },
];

export function TabsSection() {
  return (
    <ShowcaseSection title="Tabs">
      <p className={caption}>
        Flèches gauche et droite (ou haut et bas en vertical) pour changer
        d’onglet. La lecture automatique se met en pause avec son bouton ou dès
        qu’un onglet est choisi. Elle ne démarre pas si le système demande moins
        d’animations.
      </p>
      <h3 className={demoTitle}>Horizontal</h3>
      <Tabs items={simpleItems} label="Étapes d’une mission" />
      <h3 className={demoTitle}>Vertical, lecture automatique</h3>
      <Tabs
        items={dayItems}
        label="Une journée type"
        orientation="vertical"
        autoplay
      />
    </ShowcaseSection>
  );
}
