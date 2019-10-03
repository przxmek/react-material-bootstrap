import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography, Theme } from '@material-ui/core';
import { User, fromGoogleAuth, Auth, unauthorized } from 'auth';
import { connect } from 'react-redux';
import { setUser } from 'redux/actions';
import { RootStateType } from 'redux/reducers';
import GoogleLogin, { GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { GOOGLE_CLIENT_ID, GOOGLE_SCOPE } from 'config';
import { showAlert } from 'components';
import sendAuthResponse from 'api/auth';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  },
  googleButton: {
    marginTop: theme.spacing(1)
  }
}));

interface Props {
  className?: string;
  user?: User;
  setUser: (user?: User) => void;
}

const Profile: React.SFC<Props> = props => {
  const { className, user } = props;

  const classes = useStyles();

  const defaultUser = {
    name: 'Unauthenticated',
    avatar: '/images/avatars/anonymous-user.png'
  };


  const handleAuth = async (auth: Auth) => {
    if (auth.googleAuth) {
      try {
        await sendAuthResponse(
          auth.googleAuth.getAuthResponse().id_token,
          auth.googleAuth.getAuthResponse().access_token
        );
      } catch (e) {
        showAlert("error", e.message, 10000);
      }
    }
    props.setUser(auth.user);
  };

  const googleAuthSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    handleAuth(fromGoogleAuth(response as GoogleLoginResponse));
  };

  const googleAuthFailure = (response: { error: string }) => {
    showAlert('error', `Failed to sign in with Google: ${response.error}`);
  };

  const signOut = () => {
    handleAuth(unauthorized());
  };

  if (!user) {
    return (
      <div
        className={clsx(classes.root, className)}
      >
        <Avatar
          alt="Person"
          className={classes.avatar}
          src={defaultUser.avatar}
        />
        <Typography
          className={classes.name}
          variant="h4"
        >
          {defaultUser.name}
        </Typography>
        <GoogleLogin
          className={classes.googleButton}
          clientId={GOOGLE_CLIENT_ID}
          scope={GOOGLE_SCOPE}
          buttonText="Sign in"
          onSuccess={googleAuthSuccess}
          onFailure={googleAuthFailure}
          cookiePolicy={'single_host_origin'}
          accessType="offline"
          isSignedIn={true}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="User avatar"
        className={classes.avatar}
        component={RouterLink}
        src={user.imageUrl}
        to="/settings"
      />
      <Typography
        className={classes.name}
        variant="h4"
      >
        {user.name}
      </Typography>
      <Typography variant="body2">{user.email}</Typography>
      <GoogleLogout
        className={classes.googleButton}
        clientId={GOOGLE_CLIENT_ID}
        buttonText="Sign out"
        onLogoutSuccess={signOut}
      />
    </div>
  );
};

const mapStateToProps = (state: RootStateType) => {
  return {
    user: state.user
  };
};

const dispatchProps = {
  setUser
};

export default connect(
  mapStateToProps,
  dispatchProps
)(Profile);
