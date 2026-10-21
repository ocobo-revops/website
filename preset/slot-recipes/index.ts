import * as accordion from './accordion';
import * as flipCard from './flip-card';
import * as scrollArea from './scroll-area';
import * as select from './select';

export const slotRecipes = {
  ...select,
  ...scrollArea,
  ...accordion,
  ...flipCard,
};
