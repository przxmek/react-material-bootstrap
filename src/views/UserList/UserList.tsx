import React from 'react';
import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import User from 'models/user';
import { fetchUsers, putUser } from 'api/users';

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
  users: User[];
}

class UserList extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
      searchText: '',
      selectedUsers: [],
      users: [],
    };

    this.reloadUsers();
  }

  private reloadUsers = async () => {
    const users = await fetchUsers();

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

    await putUser(user);

    await this.reloadUsers();
  }

  private onChangeSelectedUsers = (selectedUsers: string[]) => {
    this.setState({ selectedUsers });
  }

  private onBulkUsersActivate = async () => {
    console.log("bulk activate");
    const { users, selectedUsers } = this.state;

    selectedUsers.forEach(async (userId) => {
      const usersFilter = users.filter(u => u.id === userId);
      if (usersFilter.length > 0 && !usersFilter[0].active) {
        const user = usersFilter[0];
        user.active = true;
        // await putUser(user);
      }

      console.log(usersFilter[0].email_address);
    });
    
    await this.reloadUsers();
  }

  public render() {
    const { classes } = this.props;
    const { searchText, users } = this.state;

    return (
      <div className={classes.root}>
        <UsersToolbar
          onSearchTextChange={this.onSearchTextChange}
          onBulkUsersActivate={this.onBulkUsersActivate}
        />
        <div className={classes.content}>
          <UsersTable
            onUserActivate={this.activateUser}
            searchText={searchText}
            users={users}
            onChangeSelectedUsers={this.onChangeSelectedUsers}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
