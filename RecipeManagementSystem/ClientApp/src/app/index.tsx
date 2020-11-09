/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, Router, Redirect } from 'react-router-dom';
import { history } from 'utils/history';

import { GlobalStyle } from 'styles/global-styles';

import 'fontsource-roboto';

import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { IngredientCategoriesPage } from './containers/IngredientCategoriesPage/Loadable';
import { IngredientsPage } from './containers/IngredientsPage/Loadable';
import { RecipesPage } from './containers/RecipesPage/Loadable';
import { RecipeTagsPage } from './containers/RecipeTagsPage/Loadable';
import { Layout } from './components/Layout';

export function App() {
  return (
    <Router history={history}>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
      >
        <meta name="description" content="A React Boilerplate application" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Helmet>
      <GlobalStyle />
      <Layout>
        <Switch>
          <Route exact path="/">
            <Redirect to="/recipes" />
          </Route>
          <Route path="/recipes" component={RecipesPage} />
          <Route path="/ingredients" component={IngredientsPage} />
          <Route path="/recipe-tags" component={RecipeTagsPage} />
          <Route
            path="/ingredient-categories"
            component={IngredientCategoriesPage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    </Router>
  );
}
