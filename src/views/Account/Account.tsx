import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Grid, Theme } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import {
  AccountProfile,
  AccountDetails,
  MailjetDetails,
  WaitlistSheet
} from './components';
import { fetchUser } from 'api/users';
import User from 'models/user';
import Contact from 'models/mailjet/contact';
import { fetchMailjetContact } from 'api/mailjet';
import { Loading, showAlert } from 'components';

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
  contact?: Contact;
  loading: boolean;
}

class Account extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
      account: undefined,
      contact: undefined,
      loading: true,
    };
  }

  public componentDidMount = async () => {
    await this.reloadData();
  }

  private reloadData = async () => {
    const emailAddress = this.props.match.params.emailAddress;

    this.setState({ loading: true });
    try {
      const account = await fetchUser(emailAddress);
      this.setState({ account });
      const contact = await fetchMailjetContact(account.email_address);
      this.setState({ contact });
    } catch (e) {
      showAlert("error", e.message, 10000);
    } finally {
      this.setState({ loading: false });
    }
  }

  private reloadAccount = async () => {
    const emailAddress = this.props.match.params.emailAddress;

    try {
      const account = await fetchUser(emailAddress);
      this.setState({ account });
    } catch (e) {
      showAlert("error", e.message, 10000);
    }
  }

  public render() {
    const { classes } = this.props;
    const { emailAddress } = this.props.match.params;
    const { account, contact, loading } = this.state;

    if (loading) {
      return (<Loading />);
    }

    if (!account) {
      showAlert("error", `User not found (email: ${emailAddress}`, 10000);
      return;
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={4} md={6} xl={4} xs={12}>
            <AccountProfile account={account} onAccountUpdate={this.reloadAccount} />
          </Grid>
          <Grid item lg={8} md={6} xl={8} xs={12}>
            <AccountDetails account={account} contact={contact} />
          </Grid>
          <Grid item lg={4} md={6} xl={4} xs={12}>
          </Grid>
          <Grid item lg={8} md={6} xl={8} xs={12}>
            <MailjetDetails emailAddress={emailAddress} />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <WaitlistSheet emailAddress={emailAddress} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Account));
