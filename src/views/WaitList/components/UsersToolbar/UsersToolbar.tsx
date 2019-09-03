import React from 'react';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { Button, Tooltip, Theme } from '@material-ui/core';

import { SearchInput } from 'components';

const styles = (theme: Theme) => createStyles({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  activateButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
});

interface Props {
  className?: string;
}
type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class UsersToolbar extends React.Component<PropsType, State> {
  private onSearchTextChange = (text: string) => {
    console.log(text);
  }

  public render() {
    const { classes, className, ...rest } = this.props;

    return (
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div className={classes.row}>
          <span className={classes.spacer} />
          <Button className={classes.importButton}>Import</Button>
          <Tooltip title="Activate selected users">
            <Button
              color="primary"
              variant="contained"
              className={classes.activateButton}
            >
              Activate
          </Button>
          </Tooltip>
          <Tooltip title="Add new (inactive) user">
            <Button
              color="primary"
              variant="contained"
            >
              Add user
        </Button>
          </Tooltip>
        </div>
        <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            placeholder="Search user"
            onChange={this.onSearchTextChange}
          />
        </div>
      </div>
    );
  };
}

export default withStyles(styles)(UsersToolbar);
