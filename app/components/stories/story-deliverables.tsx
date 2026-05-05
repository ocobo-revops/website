import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card } from '@ocobo/styled-system/recipes';

import { StoryFrontmatter } from '~/types';

interface StoryDeliverablesProps {
  items: StoryFrontmatter['deliverables'];
}

const titleStyle = css({
  fontWeight: 'bold',
  bg: 'mint.dark',
  color: 'white',
  height: '90px',
  display: 'flex',
  alignItems: 'center',
  p: 6,
});

const sectionStyle = css({
  bg: 'mint.light',
  borderColor: 'mint',
  borderBottom: 'thin',
  p: 6,
  _last: {
    borderBottom: 'none',
  },
});

const listStyle = css({
  pl: 6,
  listStyleType: 'disc',
  '& li': {
    mb: 4,
    _last: {
      mb: 0,
    },
  },
});

const StoryDeliverables: React.FunctionComponent<StoryDeliverablesProps> = ({
  items,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        card({ padding: 'md', radius: 'md', tone: 'white', border: true }),
        css({ mb: 8, padding: '0', overflow: 'hidden' }),
      )}
    >
      <h2 className={titleStyle}>{t('clients.deliverables')}</h2>
      <div className={sectionStyle}>
        <ul className={listStyle}>
          {items.map((item, i) => {
            return <li key={`deliverable-${i}`}>{item}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

StoryDeliverables.displayName = 'StoryDeliverables';

export { StoryDeliverables };
