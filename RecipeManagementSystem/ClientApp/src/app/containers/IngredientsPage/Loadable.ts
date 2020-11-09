/**
 *
 * Asynchronously loads the component for IngredientsPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const IngredientsPage = lazyLoad(
  () => import('./index'),
  module => module.IngredientsPage,
);
