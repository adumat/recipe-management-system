/**
 *
 * Asynchronously loads the component for IngredientCategoriesPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const IngredientCategoriesPage = lazyLoad(
  () => import('./index'),
  module => module.IngredientCategoriesPage,
);
