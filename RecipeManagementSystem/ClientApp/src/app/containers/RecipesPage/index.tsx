/**
 *
 * RecipesPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectRecipesPage } from './selectors';
import { recipesPageSaga } from './saga';

interface Props {}

export function RecipesPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: recipesPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const recipesPage = useSelector(selectRecipesPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title>RecipesPage</title>
        <meta name="description" content="Description of RecipesPage" />
      </Helmet>
      <div></div>
    </>
  );
}
