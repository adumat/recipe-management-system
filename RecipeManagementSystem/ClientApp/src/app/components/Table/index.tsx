/**
 *
 * Table
 *
 */
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
  Table as MaterialUITable,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Checkbox,
  TableContainer,
  TablePagination,
  Paper,
  Tooltip,
  IconButton,
  Typography,
  Toolbar,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import clsx from 'clsx';

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }),
);
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<TData, Key extends keyof TData>(
  order: Order,
  orderBy: Key,
): (
  a: TData, //{ [key in Key]: number | string },
  b: TData, //{ [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export type Order = 'asc' | 'desc';

export interface CellViewModel<TData> {
  disablePadding?: boolean;
  id: keyof TData;
  label: string;
  numeric?: boolean;
  getValue?(row: TData): string;
}

export interface TableHeadProps<TData> {
  cellViewModel: CellViewModel<TData>[];
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TData,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof TData;
  rowCount: number;
  checkboxEnable: boolean;
}

interface EnhancedTableToolbarProps {
  selected: (number | string)[];
  title: string;
  onAdd?(): void;
  onDelete?(selected: (number | string)[]): void;
  onChange?(selected: (number | string)[]): void;
  checkboxEnable: boolean;
}

export interface TableProps<TData> {
  cellViewModel: CellViewModel<TData>[];
  rows: TData[];
  idRowGetter(row: TData): number | string;
  initialOrderKey?: keyof TData;
  title: string;
  onAdd?(): void;
  onDelete?(selected: (number | string)[]): void;
  onChange?(selected: (number | string)[]): void;
  checkboxEnable?: boolean;
}

function EnhancedTableHead<TData>(props: TableHeadProps<TData>) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    checkboxEnable,
  } = props;
  const createSortHandler = (property: keyof TData) => (
    event: React.MouseEvent<unknown>,
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {checkboxEnable ? (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
        ) : null}
        {props.cellViewModel.map(headCell => (
          <TableCell
            key={headCell.id as string}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { selected, checkboxEnable } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: checkboxEnable && selected.length > 0,
      })}
    >
      {checkboxEnable && selected.length > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {props.title}
        </Typography>
      )}
      {props.onAdd ? (
        <Tooltip title="Add">
          <IconButton
            aria-label="add"
            onClick={() => (props.onAdd ? props.onAdd() : undefined)}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {selected.length > 0 && props.onChange ? (
        <Tooltip title="Edit">
          <IconButton
            aria-label="edit"
            onClick={() =>
              props.onChange ? props.onChange(selected) : undefined
            }
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {selected.length > 0 && props.onDelete ? (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() =>
              props.onDelete ? props.onDelete(selected) : undefined
            }
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {selected.length === 0 ? (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
};

export function Table<TData>(props: TableProps<TData>) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof TData>(
    props.initialOrderKey || props.cellViewModel[0].id,
  );
  const [selected, setSelected] = React.useState<(number | string)[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { checkboxEnable = false } = props;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = props.rows.map(n => props.idRowGetter(n));
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    Id: number | string,
  ) => {
    const selectedIndex = selected.indexOf(Id);
    let newSelected: (number | string)[] = [];
    if (checkboxEnable) {
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, Id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }

      setSelected(newSelected);
    } else {
      if (selectedIndex === -1) {
        newSelected = [Id];
      } else {
        newSelected = [];
      }

      setSelected(newSelected);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (Id: any) => selected.indexOf(Id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          selected={selected}
          title={props.title}
          onAdd={props.onAdd}
          onChange={props.onChange}
          onDelete={props.onDelete}
          checkboxEnable={checkboxEnable}
        />
        <TableContainer>
          <MaterialUITable
            className={classes.table}
            size={'medium'}
            padding="default"
          >
            <EnhancedTableHead<TData>
              cellViewModel={props.cellViewModel}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props.rows.length}
              checkboxEnable={checkboxEnable}
            />
            <TableBody>
              {stableSort<TData>(props.rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(props.idRowGetter(row));
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event =>
                        handleClick(event, props.idRowGetter(row))
                      }
                      // role="checkbox"
                      aria-checked={isItemSelected}
                      // tabIndex={-1}
                      key={props.idRowGetter(row)}
                      selected={isItemSelected}
                      style={{ height: 53 }}
                    >
                      {checkboxEnable ? (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                      ) : null}
                      {props.cellViewModel.map((head, headIdx) => {
                        return (
                          <TableCell
                            component="th"
                            // id={labelId}
                            scope="row"
                            // padding="none"
                            key={props.idRowGetter(row) + '' + head.id}
                          >
                            {head.getValue ? head.getValue(row) : row[head.id]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={props.cellViewModel.length} />
                </TableRow>
              )}
            </TableBody>
          </MaterialUITable>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
