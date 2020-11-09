/**
 *
 * RecipeTagsPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useParams, useRouteMatch } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectRecipeTagsPage, selectRecipeTagOnEdit } from './selectors';
import { recipeTagsPageSaga } from './saga';
import { Table } from 'app/components/Table';
import { history } from 'utils/history';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
} from '@material-ui/core';
import { IdEditorParamTypes, RecipeTag } from 'types/Models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

interface Props {}

export function RecipeTagsPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: recipeTagsPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const recipeTagsPage = useSelector(selectRecipeTagsPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const { path, url } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.fetchRecipeTagsRequest());
  }, []);

  return (
    <>
      <Helmet>
        <title>RecipeTagsPage</title>
        <meta name="description" content="Description of RecipeTagsPage" />
      </Helmet>
      <Route path={path}>
        <Table<RecipeTag>
          title={'Recipe Tag'}
          cellViewModel={[
            {
              id: 'Id',
              label: 'ID',
            },
            {
              id: 'Name',
              label: 'Name',
            },
            {
              id: 'ParentTagId',
              label: 'Parent',
              getValue: row =>
                row.ParentTagId === null
                  ? 'None'
                  : recipeTagsPage.FetchedRecipeTags.find(
                      tag => tag.Id === row.ParentTagId,
                    )?.Name || 'None',
            },
          ]}
          rows={recipeTagsPage.FetchedRecipeTags}
          idRowGetter={r => r.Id || -1}
          initialOrderKey={'Name'}
          onAdd={() => history.push(`${path}/new`)}
          onChange={rowId => history.push(`${path}/${rowId[0]}`)}
          onDelete={rowId =>
            dispatch(actions.deleteRecipeTag(rowId[0] as string))
          }
          checkboxEnable={false}
        />
      </Route>
      <Route path={`${path}/:Id`}>
        <EditDialog origin={path} />
      </Route>
    </>
  );
}

interface EditDialogProps {
  origin: string;
}

function EditDialog(props: EditDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Id, Name, Description, ParentTagId } = useSelector(
    selectRecipeTagOnEdit,
  );
  const { FetchedRecipeTags: tags } = useSelector(selectRecipeTagsPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const { Id: IdParam } = useParams<IdEditorParamTypes>();
  const classes = useStyles();

  useEffect(() => {
    if (IdParam !== undefined) {
      if (IdParam === 'new') {
        //new ingredient
        dispatch(actions.newRecipeTag());
      } else {
        //load ingredient
        dispatch(actions.loadRecipeTag(IdParam));
      }
    }
  }, [IdParam]);

  const handleUndoChanges = () => {
    history.push(props.origin);
  };

  const handleDoChanges = () => {
    dispatch(actions.saveRecipeTagOnChange());
    history.push(props.origin);
  };

  return (
    <Dialog
      open={IdParam !== undefined}
      onClose={handleUndoChanges}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {IdParam !== 'new' ? 'Edit recipe tag' : 'New recipe tag'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {IdParam !== 'new' ? 'Change input below' : 'Fill input below'}
        </DialogContentText>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            disabled
            id="i_id"
            label="Id"
            helperText="Auto generated Id"
            value={Id}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            required
            id="i_name"
            label="Name"
            helperText="Name of tag"
            value={Name}
            variant="outlined"
            onChange={event =>
              dispatch(
                actions.inputPropChanged({
                  prop: 'Name',
                  value: event.target.value,
                }),
              )
            }
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            required
            id="i_name"
            label="Description"
            helperText="Description of tag"
            value={Description}
            variant="outlined"
            onChange={event =>
              dispatch(
                actions.inputPropChanged({
                  prop: 'Description',
                  value: event.target.value,
                }),
              )
            }
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="i_cat-label">Category</InputLabel>
          <Select
            autoWidth
            id="i_cat"
            labelId="i_cat-label"
            label="Parent"
            value={ParentTagId}
            onChange={event =>
              dispatch(
                actions.inputPropChanged({
                  prop: 'ParentTagId',
                  value: event.target.value || -1,
                }),
              )
            }
          >
            <MenuItem key={-1} value={-1}>
              None
            </MenuItem>
            {tags
              .filter(tag => tag.Id !== Id && tag.ParentTagId === null)
              .map(tag => (
                <MenuItem key={tag.Id} value={tag.Id}>
                  {tag.Name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>For herarchical tag</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUndoChanges} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDoChanges} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
