import { Briefcase, MapPin, Users } from 'lucide-react';

import { css } from '@ocobo/styled-system/css';
import { hstack } from '@ocobo/styled-system/patterns';

import { MetaPill } from '~/components/ui/meta-pill';

import { ShowcaseSection } from './showcase-section';

export function MetaPillSection() {
  return (
    <ShowcaseSection title="MetaPill">
      <ul className={hstack({ gap: '4' })}>
        <li>
          <MetaPill
            icon={<MapPin size={14} className={css({ color: 'ocobo.sky' })} />}
          >
            Paris, France
          </MetaPill>
        </li>
        <li>
          <MetaPill
            icon={
              <Briefcase size={14} className={css({ color: 'ocobo.yellow' })} />
            }
          >
            CDI
          </MetaPill>
        </li>
        <li>
          <MetaPill
            icon={<Users size={14} className={css({ color: 'ocobo.mint' })} />}
          >
            Senior
          </MetaPill>
        </li>
      </ul>
    </ShowcaseSection>
  );
}
