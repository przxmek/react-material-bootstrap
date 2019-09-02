import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Grid, Theme } from '@material-ui/core';

import { AccountProfile, AccountDetails } from './components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { fetchUser } from 'api/users';
import User from 'models/user';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(4)
  }
});

interface PathParamsType {
  emailAddress: string;
}

type PropsType = WithStyles<typeof styles> & RouteComponentProps<PathParamsType>;

interface State {
  account?: User;
}

class Account extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
      account: undefined
    };
  }

  public componentDidMount() {
    const emailAddress = this.props.match.params.emailAddress;

    fetchUser(emailAddress)
      .then((account: User) => {
        this.setState({ account });
      });
  }

  public render() {
    const { classes } = this.props;
    const { account } = this.state;

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={4} md={6} xl={4} xs={12}>
            <AccountProfile account={account} />
          </Grid>
          <Grid item lg={8} md={6} xl={8} xs={12}>
            <AccountDetails account={account} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Account));
