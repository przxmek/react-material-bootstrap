import React from 'react';
import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import mockData from './data';
import User from './user';

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
    const response = await fetch('http://localhost:5000/users');

    const json = await response.json();
    const users = json.users;

    console.log(users[0]);

    this.setState({ users });

    return mockData;
  }

  public render() {
    const { classes } = this.props;
    const { users } = this.state;

    return (
      <div className={classes.root}>
        <UsersToolbar />
        <div className={classes.content}>
          <UsersTable users={users} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(WaitList);
