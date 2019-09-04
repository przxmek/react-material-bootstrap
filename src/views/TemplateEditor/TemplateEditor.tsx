import React from 'react';
import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
});

type PropsType = WithStyles<typeof styles>;

interface State { }

class TemplateEditor extends React.Component<PropsType, State> {
  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {/* <UsersToolbar
          onSearchTextChange={this.onSearchTextChange}
          onBulkUsersActivate={this.onBulkUsersActivate}
        /> */}
        <div className={classes.content}>
          {/* <UsersTable
            onUserActivate={this.activateUser}
            searchText={searchText}
            users={users}
            onChangeSelectedUsers={this.onChangeSelectedUsers}
          /> */}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateEditor);
