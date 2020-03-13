import React from 'react';
import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import User from 'models/user';
import { fetchUsers, putUser } from 'api/users';
import { Loading, showAlert } from 'components';
import { Redirect } from 'react-router-dom';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
});

type PropsType = WithStyles<typeof styles>;

interface State {
  searchText: string;
  selectedUsers: string[];
  unauthorized?: boolean;
  users?: User[];
}

class UserList extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
      searchText: '',
      selectedUsers: [],
      users: undefined,
    };
  }

  public componentDidMount = async () => {
    this.reloadUsers();
  }

  private reloadUsers = async () => {
    let users: User[] = [];
    try {
      users = await fetchUsers();
    } catch (e) {
      this.setState({ unauthorized: true });
    }

    // Sort
    users.sort((a, b) => {
      if (a.active && !b.active) {
        return 1;
      }
      if (a.active === b.active && a.active === true && a.id < b.id) {
        return 1;
      }
      if (a.active === b.active && a.active === false && a.id > b.id) {
        return 1;
      }
      return -1;
    });

    this.setState({ users });
  }

  private onSearchTextChange = (searchText: string) => {
    this.setState({ searchText });
  }

  private activateUser = async (user: User) => {
    user.active = true;

    showAlert("info", `Processing...`, 5000);

    await putUser(user);

    await this.reloadUsers();

    showAlert("success", `User ${user.email_address} activated.`, 5000);
  }

  private onChangeSelectedUsers = (selectedUsers: string[]) => {
    this.setState({ selectedUsers });
  }

  private onBulkUsersActivate = async () => {
    const { selectedUsers, users } = this.state;
    const promises: Array<Promise<any>> = [];

    if (!users) {
      return;
    }

    if (!selectedUsers.length) {
      showAlert("warning", "No users selected.", 5000);
      return;
    }

    selectedUsers.forEach(async (userId) => {
      const usersFilter = users.filter(u => u.id === userId);
      if (usersFilter.length > 0 && !usersFilter[0].active) {
        const user = usersFilter[0];
        user.active = true;
        promises.push(putUser(user));
      }
    });

    showAlert("info", "Processing...", 5000);

    await Promise.all(promises);
    await this.reloadUsers();

    showAlert("success", `${selectedUsers.length} users activated!`, 5000);
  }

  public render() {
    const { classes } = this.props;
    const { searchText, unauthorized, users } = this.state;

    if (!users) {
      return (<Loading />);
    }

    if (unauthorized) {
      return <Redirect to="/sign-in" />;
    }

    return (
      <div className={classes.root}>
        <UsersToolbar
          onSearchTextChange={this.onSearchTextChange}
          onBulkUsersActivate={this.onBulkUsersActivate}
        />
        <div className={classes.content}>
          <UsersTable
            onUserActivate={this.activateUser}
            onChangeSelectedUsers={this.onChangeSelectedUsers}
            searchText={searchText}
            users={users}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
