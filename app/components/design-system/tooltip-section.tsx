import { css } from '@ocobo/styled-system/css';
import { hstack } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { Tooltip } from '~/components/ui/tooltip';

import { ShowcaseSection } from './showcase-section';

const chip = css({
  px: '4',
  py: '2',
  bg: 'white',
  borderWidth: '1px',
  borderColor: 'line',
  rounded: 'full',
  fontWeight: 'bold',
});

const kpiContent = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
});

const kpiLabel = css({ color: 'white/75' });
const kpiTitle = css({ fontWeight: 'bold', fontSize: 'body' });

export function TooltipSection() {
  return (
    <ShowcaseSection title="Tooltip">
      <p className={text({ variant: 'small' })}>
        Survolez, touchez ou atteignez au clavier chaque déclencheur. Échap ou
        une touche en dehors referme le tooltip.
      </p>
      <ul className={hstack({ gap: '6', mt: '6', flexWrap: 'wrap' })}>
        <li>
          <Tooltip
            content="Texte court qui précise le déclencheur."
            triggerClassName={chip}
          >
            Texte simple
          </Tooltip>
        </li>
        <li>
          <Tooltip
            triggerClassName={chip}
            content={
              <span className={kpiContent}>
                <span className={kpiLabel}>Jalon · MQL</span>
                <span className={kpiTitle}>Volume de MQL et coût par MQL</span>
                <span>
                  Combien de prospects qualifiés le marketing génère, et à quel
                  coût.
                </span>
              </span>
            }
          >
            KPI d’une étape
          </Tooltip>
        </li>
        <li>
          <Tooltip
            placement="bottom"
            content="Placé sous le déclencheur."
            triggerClassName={chip}
          >
            En dessous
          </Tooltip>
        </li>
      </ul>
    </ShowcaseSection>
  );
}
