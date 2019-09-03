import React, { ChangeEvent } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Theme,
  Button
} from '@material-ui/core';

import User from 'models/user';
import { putUser } from 'api/users';

const styles = (theme: Theme) => createStyles({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  tableRow: {

  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  activateButton: {
    marginRight: theme.spacing(1)
  },
});

interface Props {
  className?: string;
  refreshUsers: () => void;
  searchText: string;
  users: User[];
}
type PropsType = Props & WithStyles<typeof styles>;

interface State {
  filteredUsers: User[];
  page: number;
  rowsPerPage: number;
  filterText: string;
  selectedUsers: string[];
}

class UsersTable extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      filteredUsers: props.users.slice(),
      page: 0,
      rowsPerPage: 10,
      filterText: '',
      selectedUsers: [],
    };
  }

  public componentDidUpdate(prevProps: PropsType) {
    const { searchText, users } = this.props;

    if (prevProps.searchText !== searchText || prevProps.users !== users) {
      this.onSearchTextChange(searchText);
    }
  }

  private activateUser = async (user: User) => {
    const { refreshUsers } = this.props;

    user.active = true;

    await putUser(user);

    refreshUsers();
  }

  private onSearchTextChange = (searchText: string) => {
    const { users } = this.props;
    const filteredUsers = this.filterUsers(searchText, users);
    this.setState({ filteredUsers, selectedUsers: [], page: 0 });
  }

  private filterUsers = (filterText: string, users: User[]): User[] => {
    if (filterText.trim() === '') {
      return users.slice();
    }

    const filterTextLower = filterText.trim().toLowerCase();

    const a = users.filter(u => u.email_address.toLowerCase().startsWith(filterTextLower));
    const b = users.filter(u => u.email_address.toLowerCase().includes(filterTextLower));
    const c = "active".startsWith(filterTextLower) ? users.filter(u => u.active) : [];
    const d = "inactive".startsWith(filterTextLower) ? users.filter(u => !u.active) : [];

    const results = a.concat(b, c, d);
    const deduplicated = results.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

    return deduplicated;
  }

  private setSelectedUsers = (selectedUsers: string[]) => {
    this.setState({ selectedUsers });
  }

  private setRowsPerPage = (rowsPerPage: number) => {
    this.setState({ rowsPerPage });
  }

  private setPage = (page: number) => {
    this.setState({ page });
  }

  private handleSelectAll = (event: ChangeEvent, checked: boolean) => {
    const { users } = this.props;

    let selectedUsers: string[];

    if (checked) {
      selectedUsers = users.map(user => user.id);
    } else {
      selectedUsers = [];
    }

    this.setSelectedUsers(selectedUsers);
  }

  private handleSelectOne = (event: ChangeEvent<HTMLElement>, id: string) => {
    const { selectedUsers } = this.state;

    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers: string[] = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    this.setSelectedUsers(newSelectedUsers);
  }

  private handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, pageNumber: number) => {
    this.setPage(pageNumber);
  }

  private handleRowsPerPageChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setRowsPerPage(parseInt(event.target.value, 10));
    this.setPage(0);
  }

  public render() {
    const { className, classes, ...rest } = this.props;
    const { filteredUsers, page, rowsPerPage, selectedUsers } = this.state;

    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.length === filteredUsers.length}
                        color="primary"
                        indeterminate={
                          selectedUsers.length > 0 &&
                          selectedUsers.length < filteredUsers.length
                        }
                        onChange={this.handleSelectAll}
                      />
                    </TableCell>
                    {/* <TableCell>Name</TableCell> */}
                    <TableCell>Email</TableCell>
                    {/* <TableCell>Location</TableCell> */}
                    {/* <TableCell>Phone</TableCell> */}
                    <TableCell>Registration date</TableCell>
                    <TableCell>Last login</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={user.id}
                      selected={selectedUsers.indexOf(user.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedUsers.indexOf(user.id) !== -1}
                          color="primary"
                          onChange={event => this.handleSelectOne(event, user.id)}
                          value="true"
                        />
                      </TableCell>
                      {/* <TableCell>
                        <div className={classes.nameContainer}>
                          <Avatar
                            className={classes.avatar}
                            src={user.avatarUrl}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Typography variant="body1">{user.name}</Typography>
                        </div>
                      </TableCell> */}
                      <TableCell>{user.email_address}</TableCell>
                      {/* <TableCell>
                        {user.address != null && (<>
                          {user.address.city}, {user.address.state}, {' '}
                          {user.address.country}
                        </>)}
                      </TableCell> */}
                      {/* <TableCell>{user.phone}</TableCell> */}
                      <TableCell>
                        {moment(user.create_date).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        {user.last_login && (<>{moment(user.last_login).format('DD/MM/YYYY')}</>)}
                        {!user.last_login && (<>--</>)}

                      </TableCell>
                      <TableCell>
                        {(user.active) && (
                          <Button
                            disabled
                            color="primary"
                            variant="outlined"
                            size="small"
                            className={classes.activateButton}
                          >
                            Activated
                          </Button>
                        )}
                        {(!user.active) && (
                          <Button
                            color="primary"
                            variant="outlined"
                            size="small"
                            className={classes.activateButton}
                            onClick={() => this.activateUser(user)}
                          >
                            Activate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={filteredUsers.length}
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 100]}
          />
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(UsersTable);
