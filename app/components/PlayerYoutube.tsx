import * as React from 'react';

import { css } from '@ocobo/styled-system/css';

const PlayerYoutube: React.FunctionComponent<{
  id: string;
  title?: string;
  className?: string;
}> = ({ id, title, ...props }) => {
  return (
    <div {...props}>
      <div
        className={css({
          overflow: 'hidden',
          pb: '[56.25%]',
          position: 'relative',
          h: '0',
        })}
      >
        <iframe
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          title={title || 'Youtube Player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className={css({
            w: 'full',
            h: 'full',
            position: 'absolute',
            top: '0',
            left: '0',
          })}
        />
      </div>
    </div>
  );
};

PlayerYoutube.displayName = 'PlayerYoutube';

export { PlayerYoutube };
