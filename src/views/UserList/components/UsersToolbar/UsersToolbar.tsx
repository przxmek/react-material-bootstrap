import React from 'react';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { Button, Tooltip, Theme } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import CreditCardIcon from '@material-ui/icons/CreditCard';

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
  marginRight: {
    marginRight: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  },
});

interface Props {
  className?: string;
  onBulkUsersActivate?: () => void;
  onSearchTextChange?: (text: string) => void;
}
type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class UsersToolbar extends React.Component<PropsType, State> {
  public render() {
    const { classes, className, onSearchTextChange, onBulkUsersActivate, ...rest } = this.props;

    return (
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div className={classes.row}>
          <span className={classes.spacer} />

          <Tooltip title="Add new (inactive) user">
            <Button
              variant="contained"
              className={classes.marginRight}
              disabled
            >
              Add user
            </Button>
          </Tooltip>

          <Tooltip title="Activate selected users">
            <Button
              variant="contained"
              className={classes.marginRight}
              onClick={onBulkUsersActivate}
            >
              Activate
            </Button>
          </Tooltip>

          <Tooltip title="Open Stripe customers list">
            <Button
              variant="contained"
              className={classes.marginRight}
              href="https://dashboard.stripe.com/customers"
            >
              <CreditCardIcon className={clsx(classes.marginRight, classes.iconSmall)} />
              Stripe
            </Button>
          </Tooltip>

          <Tooltip title="Open mailjet 'Waitlist' contacts">
            <Button
              variant="contained"
              className={classes.marginRight}
              href="https://app.mailjet.com/contacts/lists/show/GSAX"
            >
              <SendIcon className={clsx(classes.marginRight, classes.iconSmall)} />
              Mailjet
            </Button>
          </Tooltip>
        </div>

        <div className={classes.row}>
          <SearchInput
            className={classes.marginRight}
            placeholder="Search user"
            onChange={onSearchTextChange}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(UsersToolbar);
