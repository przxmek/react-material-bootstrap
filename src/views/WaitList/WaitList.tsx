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
  users: User[];
}

class WaitList extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
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

  public render() {
    const { classes } = this.props;
    const { users } = this.state;

    return (
      <div className={classes.root}>
        <UsersToolbar />
        <div className={classes.content}>
          <UsersTable users={users} refreshUsers={() => this.loadUsers()} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(WaitList);
