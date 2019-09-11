import React from 'react';
import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import User from 'models/user';
import { fetchUsers, putUser } from 'api/users';
import { fetchMailjetContacts } from 'api/mailjet';
import Contact from 'models/mailjet/contact';
import { Loading, showAlert } from 'components';

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
  contacts?: Contact[];
  searchText: string;
  selectedUsers: string[];
  users?: User[];
}

class UserList extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
      contacts: undefined,
      searchText: '',
      selectedUsers: [],
      users: undefined,
    };
  }

  public componentDidMount = async () => {
    this.reloadMailjetContacts();
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

  private reloadMailjetContacts = async () => {
    const contacts = await fetchMailjetContacts();
    this.setState({ contacts });
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
    const { users, selectedUsers } = this.state;
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
    const { contacts, searchText, users } = this.state;

    if (!users) {
      return (<Loading />);
    }

    return (
      <div className={classes.root}>
        <UsersToolbar
          onSearchTextChange={this.onSearchTextChange}
          onBulkUsersActivate={this.onBulkUsersActivate}
        />
        <div className={classes.content}>
          <UsersTable
            contacts={contacts}
            onUserActivate={this.activateUser}
            onChangeSelectedUsers={this.onChangeSelectedUsers}
            onMailjetUpdate={this.reloadMailjetContacts}
            searchText={searchText}
            users={users}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
