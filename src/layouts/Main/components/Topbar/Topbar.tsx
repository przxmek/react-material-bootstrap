import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout } from 'react-google-login';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Typography, Theme } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import { fromGoogleAuth, Auth, unauthorized } from 'auth';
import { showAlert } from 'components';

const styles = (theme: Theme) => createStyles({
  root: {
    boxShadow: 'none'
  },
  logo: {
    height: '36px',
    display: 'inline-block'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
});

interface Props {
  className?: string;
  onSidebarOpen: () => void;
  onAuth: (auth: Auth) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  authorized: boolean;
  notifications: any[];
}

class Topbar extends React.Component<PropsType, State> {

  public state = {
    authorized: false,
    notifications: [],
  };

  private googleAuthSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const { onAuth } = this.props;

    onAuth(fromGoogleAuth(response as GoogleLoginResponse));
    this.setState({ authorized: true });
  }

  private googleAuthFailure = (response: { error: string }) => {
    showAlert('error', `Failed to sign in with Google: ${response.error}`);
    this.setState({ authorized: false });
  }

  private signOut = () => {
    const { onAuth } = this.props;
    const { authorized } = this.state;

    if (authorized) {
      this.setState({ authorized: false });
      onAuth(unauthorized());
    }
  }

  public render() {
    const { className, classes, onSidebarOpen, ...rest } = this.props;
    const { authorized, notifications } = this.state;

    return (
      <AppBar
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Toolbar>
          <RouterLink to="/">
            <img
              className={classes.logo}
              alt="Point."
              src="/images/logos/point-logo.svg"
            />
            <Typography color="textPrimary" variant="h2" display="inline"> Admin Dashboard</Typography>
          </RouterLink>
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            <IconButton color="inherit">
              <Badge
                badgeContent={notifications.length}
                color="primary"
                variant="dot"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Hidden>
          <Hidden lgUp>
            <IconButton
              color="inherit"
              onClick={onSidebarOpen}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          {!authorized && (
            <GoogleLogin
              clientId="772957098874-tn6n2pk1l14le633l9i2iri2dagoiqeo.apps.googleusercontent.com"
              buttonText="Sign in"
              onSuccess={this.googleAuthSuccess}
              onFailure={this.googleAuthFailure}
              cookiePolicy={'single_host_origin'}
            />
          )}
          {authorized && (
            <GoogleLogout
              clientId="772957098874-tn6n2pk1l14le633l9i2iri2dagoiqeo.apps.googleusercontent.com"
              buttonText="Sign out"
              onLogoutSuccess={this.signOut}
            />
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Topbar);
