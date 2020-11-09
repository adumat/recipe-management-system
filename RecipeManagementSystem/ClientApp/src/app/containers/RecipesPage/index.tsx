/**
 *
 * RecipesPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import {
  selectFetchedIngredients,
  selectRecipeOnEdit,
  selectRecipesPage,
  selectFetchedRecipeTags,
} from './selectors';
import { recipesPageSaga } from './saga';
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
  Grid,
  IconButton,
  Tabs,
  Tab,
  Box,
  Input,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import { Autocomplete } from '@material-ui/lab';
import {
  IdEditorParamTypes,
  Recipe,
  RecipeTag,
  UnitOfMeasure,
} from 'types/Models';
import { Route, useParams, useRouteMatch } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      width: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  }),
);

interface Props {}

export function RecipesPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: recipesPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const recipesPage = useSelector(selectRecipesPage);
  const tags = useSelector(selectFetchedRecipeTags);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const { path, url } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.fetchRecipesRequest());
  }, []);

  return (
    <>
      <Helmet>
        <title>RecipesPage</title>
        <meta name="description" content="Description of Recipes" />
      </Helmet>
      <Route path={path}>
        <Table<Recipe>
          title={'Recipe'}
          cellViewModel={[
            {
              id: 'Id',
              label: 'ID',
            },
            {
              id: 'Title',
              label: 'Title',
            },
            {
              id: 'Tags',
              label: 'Tags',
              getValue: row =>
                tags
                  .filter(tag => row.Tags.indexOf(tag.Id || -1) !== -1)
                  .map(tag => tag.Name)
                  .join(', '),
            },
          ]}
          rows={recipesPage.FetchedRecipes}
          idRowGetter={r => r.Id || -1}
          initialOrderKey={'Title'}
          onAdd={() => history.push(`${path}/new`)}
          onChange={rowId => history.push(`${path}/${rowId[0]}`)}
          onDelete={rowId => dispatch(actions.deleteRecipe(rowId[0] as string))}
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function EditDialog(props: EditDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const { Id: IdParam } = useParams<IdEditorParamTypes>();
  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  useEffect(() => {
    if (IdParam !== undefined) {
      if (IdParam === 'new') {
        //new ingredient
        dispatch(actions.newRecipe());
      } else {
        //load ingredient
        dispatch(actions.loadRecipe(IdParam));
      }
    }
  }, [IdParam]);

  const handleUndoChanges = () => {
    history.push(props.origin);
  };

  const handleDoChanges = () => {
    dispatch(actions.saveRecipeOnChange());
    history.push(props.origin);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
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
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="Definition" {...a11yProps(0)} />
          <Tab label="Ingredients" {...a11yProps(1)} />
          <Tab label="Steps" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <MainTab />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <IngredientsTab />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <StepTab />
        </TabPanel>
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

function MainTab() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const tags = useSelector(selectFetchedRecipeTags);
  const { Id: IdParam } = useParams<IdEditorParamTypes>();

  const { Id, Title, Introduction, FinalConsiderations, Tags } = useSelector(
    selectRecipeOnEdit,
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DialogContentText>
          {IdParam !== 'new' ? 'Change input below' : 'Fill input below'}
        </DialogContentText>
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            required
            id="r_title"
            label="Title"
            helperText="Title of Recipe"
            value={Title}
            variant="outlined"
            onChange={event =>
              dispatch(
                actions.inputPropChanged({
                  prop: 'Title',
                  value: event.target.value,
                }),
              )
            }
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            required
            id="r_introduction"
            label="Introduction"
            helperText="Introduction of Recipe"
            value={Introduction}
            variant="outlined"
            multiline
            rows={4}
            rowsMax={20}
            onChange={event =>
              dispatch(
                actions.inputPropChanged({
                  prop: 'Introduction',
                  value: event.target.value,
                }),
              )
            }
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            required
            id="r_final-onsiderations"
            label="Final Considerations"
            helperText="Final Considerations of Recipe"
            value={FinalConsiderations}
            variant="outlined"
            multiline
            rows={4}
            rowsMax={20}
            onChange={event =>
              dispatch(
                actions.inputPropChanged({
                  prop: 'FinalConsiderations',
                  value: event.target.value,
                }),
              )
            }
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="outlined" className={classes.formControl}>
          <Autocomplete
            multiple
            autoComplete
            fullWidth
            id="r_tags"
            options={tags.map(t => t.Id)}
            getOptionLabel={id => tags.find(t => t.Id === id)?.Name || 'ERR'}
            value={Tags}
            filterSelectedOptions
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Tags"
              />
            )}
            onChange={(event, value) =>
              dispatch(
                actions.inputPropChanged({
                  prop: 'Tags',
                  value: value,
                }),
              )
            }
          />
          <FormHelperText>Tag of recipe</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            disabled
            id="r_id"
            label="Id"
            helperText="Auto generated Id"
            value={Id}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}

function IngredientsTab() {
  const { UseOfIngredients } = useSelector(selectRecipeOnEdit);
  const dispatch = useDispatch();
  const classes = useStyles();
  const ingredients = useSelector(selectFetchedIngredients);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DialogContentText>
          Ingredients of Recipe:
          <IconButton
            aria-label="add"
            size="small"
            onClick={() => dispatch(actions.addUseOfIngredient())}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </DialogContentText>
        {UseOfIngredients.map(ui => (
          <Grid key={ui.IngredientId} container spacing={3}>
            <Grid item xs={5}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id={`i_label_${ui.IngredientId}`}>
                  Ingredient
                </InputLabel>
                <Select
                  autoWidth
                  // id="r_ing"
                  labelId={`i_label_${ui.IngredientId}`}
                  label="Ingredient"
                  value={ui.IngredientId}
                  onChange={event =>
                    dispatch(
                      actions.editUseOfIngredient({
                        prop: 'IngredientId',
                        value: event.target.value || -1,
                        originalObj: ui,
                      }),
                    )
                  }
                >
                  <MenuItem key={-1} value={-1}>
                    None
                  </MenuItem>
                  {ingredients
                    .filter(
                      i =>
                        i.Id === ui.IngredientId ||
                        UseOfIngredients.find(m => m.IngredientId === i.Id) ===
                          undefined,
                    )
                    .map(i => (
                      <MenuItem key={i.Id} value={i.Id}>
                        {i.Name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  id={`i_amount_${ui.IngredientId}`}
                  label="Amount"
                  // helperText="Auto generated Id"
                  value={ui.Quantity}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  onChange={event =>
                    dispatch(
                      actions.editUseOfIngredient({
                        prop: 'Quantity',
                        value: Number(event.target.value) || 0,
                        originalObj: ui,
                      }),
                    )
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id={`i_label_${ui.IngredientId}`}>Unit</InputLabel>
                <Select
                  autoWidth
                  // id="r_ing"
                  labelId={`i_label_${ui.IngredientId}`}
                  label="Unit"
                  value={ui.Unit}
                  onChange={event =>
                    dispatch(
                      actions.editUseOfIngredient({
                        prop: 'Unit',
                        value: event.target.value || -1,
                        originalObj: ui,
                      }),
                    )
                  }
                >
                  <MenuItem key="grams" value={1}>
                    Grams
                  </MenuItem>
                  <MenuItem key="liter" value={2}>
                    Liter
                  </MenuItem>
                  <MenuItem key="ml" value={3}>
                    mL
                  </MenuItem>
                  <MenuItem key="spoon" value={4}>
                    Spoon
                  </MenuItem>
                  <MenuItem key="count" value={5}>
                    Count
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete"
                // size="small"
                onClick={() => dispatch(actions.removeUseOfIngredient(ui))}
                style={{ paddingTop: 20 }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

function StepTab() {
  const { PreparationSteps } = useSelector(selectRecipeOnEdit);
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DialogContentText>
          Steps of Recipe:
          <IconButton
            aria-label="add"
            size="small"
            onClick={() => dispatch(actions.addStep())}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </DialogContentText>
        {[...PreparationSteps]
          .sort((a, b) => a.OrderIdx - b.OrderIdx)
          .map(step => (
            <Grid key={step.OrderIdx} container spacing={3}>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <TextField
                    required
                    label="Description of step"
                    // helperText="Final Considerations of Recipe"
                    value={step.Description}
                    variant="outlined"
                    multiline
                    rows={4}
                    rowsMax={20}
                    onChange={event =>
                      dispatch(
                        actions.editStep({
                          prop: 'Description',
                          value: event.target.value || '',
                          originalObj: step,
                        }),
                      )
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id={`i_label_${step.OrderIdx}`}>Order</InputLabel>
                  <Select
                    autoWidth
                    // id="r_ing"
                    labelId={`i_label_${step.OrderIdx}`}
                    label="Order"
                    value={step.OrderIdx}
                    onChange={event =>
                      dispatch(
                        actions.editOrderOfStep({
                          newOrder: Number(event.target.value),
                          originalObj: step,
                        }),
                      )
                    }
                  >
                    {Array.from(Array(PreparationSteps.length).keys()).map(
                      o => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
              </Grid>
              {step.OrderIdx > 0 ? (
                <Grid item xs={1}>
                  <IconButton
                    aria-label="up"
                    // size="small"
                    onClick={() =>
                      dispatch(
                        actions.editOrderOfStep({
                          newOrder: step.OrderIdx - 1,
                          originalObj: step,
                        }),
                      )
                    }
                  >
                    <ArrowUpward fontSize="inherit" />
                  </IconButton>
                </Grid>
              ) : (
                <Grid item xs={1}></Grid>
              )}
              {step.OrderIdx < PreparationSteps.length - 1 ? (
                <Grid item xs={1}>
                  <IconButton
                    aria-label="down"
                    // size="small"
                    onClick={() =>
                      dispatch(
                        actions.editOrderOfStep({
                          newOrder: step.OrderIdx + 1,
                          originalObj: step,
                        }),
                      )
                    }
                  >
                    <ArrowDownward fontSize="inherit" />
                  </IconButton>
                </Grid>
              ) : (
                <Grid item xs={1}></Grid>
              )}
              <Grid item xs={1}>
                <IconButton
                  aria-label="delete"
                  // size="small"
                  onClick={() => dispatch(actions.removeStep(step))}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
}
