import React from 'react';
import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import User from 'models/user';
import { fetchUsers } from 'api/users';

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
  users: User[];
}

class UserList extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
      searchText: '',
      users: []
    };

    this.loadUsers();
  }

  private loadUsers = async () => {
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

  public render() {
    const { classes } = this.props;
    const { searchText, users } = this.state;

    return (
      <div className={classes.root}>
        <UsersToolbar onSearchTextChange={this.onSearchTextChange} />
        <div className={classes.content}>
          <UsersTable
            refreshUsers={() => this.loadUsers()}
            searchText={searchText}
            users={users}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
