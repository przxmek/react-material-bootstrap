import React from 'react';
import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { fetchSnippets } from 'api/snippetGenerator';
import { RouteComponentProps } from 'react-router-dom';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
});

interface PathParamsType {
  emailAddress: string;
}

type PropsType = WithStyles<typeof styles> & RouteComponentProps<PathParamsType>;

interface State { }
  
class TemplateEditor extends React.Component<PropsType, State> {
  public componentDidMount = async () => {
    const emailAddress = this.props.match.params.emailAddress;

    const templates = await fetchSnippets(emailAddress, "templates");
    const snippets = await fetchSnippets(emailAddress, "snippets");

    console.log(templates);
    console.log(snippets);
  }
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
