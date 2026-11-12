import type * as React from 'react';

import { css, cx } from '@ocobo/styled-system/css';

/** Small uppercase label of the panel cards ("Notre périmètre", "ROI"). */
export const panelLabelStyles = css({
  fontSize: 'label',
  fontWeight: 'bold',
  letterSpacing: 'tag',
  textTransform: 'uppercase',
});

const footerLayout = {
  wide: css({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  compact: css({ flexDirection: 'column', alignItems: 'flex-start' }),
};

/**
 * Footer line under the wide panels: a hairline, muted text and an
 * optional link. One column in the mobile accordion.
 */
export function PanelFooter({
  compact,
  children,
}: {
  compact: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        css({
          display: 'flex',
          gap: '4',
          mx: '1.5',
          mt: '2',
          mb: '0.5',
          pt: '3',
          px: '2.5',
          pb: '1',
          borderTopWidth: '1px',
          borderColor: 'line',
          fontSize: 'caption',
          fontWeight: 'medium',
          color: 'gray',
        }),
        compact ? footerLayout.compact : footerLayout.wide,
      )}
    >
      {children}
    </div>
  );
}
