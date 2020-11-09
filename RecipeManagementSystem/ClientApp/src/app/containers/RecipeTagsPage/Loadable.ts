/**
 *
 * Asynchronously loads the component for RecipeTagsPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const RecipeTagsPage = lazyLoad(
  () => import('./index'),
  module => module.RecipeTagsPage,
);
