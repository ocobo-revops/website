import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';

export const StageHeaders = () => {
  const { t } = useTranslation('method');
  const stages = t('scope.stages', { returnObjects: true }) as string[];

  return (
    <div
      className={grid({
        columns: 6,
        gap: '0',
      })}
    >
      {stages.map((stage, i) => (
        <div
          key={`stage-${i}`}
          className={css({
            bg: 'ocobo.dark',
            textAlign: 'center',
            color: 'white',
            py: '8',
            px: '1',
            fontSize: { base: 'xs', md: 'sm' },
            fontWeight: 'black',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            borderRightWidth: '1px',
            borderRightColor: 'white/5',
            _last: { borderRightWidth: '0' },
          })}
        >
          {stage}
        </div>
      ))}
    </div>
  );
};
