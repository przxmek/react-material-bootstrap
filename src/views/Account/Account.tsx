import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Grid, Theme } from '@material-ui/core';

import { AccountProfile, AccountDetails, MailjetDetails } from './components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { fetchUser } from 'api/users';
import User from 'models/user';
import Contact from 'models/mailjet/contact';
import { fetchMailjetContact } from 'api/mailjet';
import { Loading } from 'components';
import WaitlistSheet from './components/WaitlistSheet/WaitlistSheet';

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
}

class Account extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
      account: undefined,
      contact: undefined
    };
  }

  public componentDidMount = async () => {
    const emailAddress = this.props.match.params.emailAddress;

    const account = await fetchUser(emailAddress);
    const contact = await fetchMailjetContact(account.email_address);

    this.setState({ account, contact });
  }

  public render() {
    const { classes } = this.props;
    const { emailAddress } = this.props.match.params;
    const { account, contact } = this.state;

    if (!account || !contact) {
      return (<Loading />);
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={4} md={6} xl={4} xs={12}>
            <AccountProfile account={account} />
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
