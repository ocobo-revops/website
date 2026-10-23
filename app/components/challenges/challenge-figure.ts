import { css } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

/** A figure in a tile, as in the agent window and the partner metrics. */
export const figureText = text({ variant: 'display-md-bold' });

/** Keeps a value such as "1,24 M€" on one line. */
export const unbroken = css({ whiteSpace: 'nowrap' });

/** Read by screen readers, hidden on screen. */
export const visuallyHidden = css({ srOnly: true });
