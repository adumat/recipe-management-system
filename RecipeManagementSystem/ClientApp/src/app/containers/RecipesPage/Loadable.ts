/**
 *
 * Asynchronously loads the component for RecipesPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const RecipesPage = lazyLoad(
  () => import('./index'),
  module => module.RecipesPage,
);
