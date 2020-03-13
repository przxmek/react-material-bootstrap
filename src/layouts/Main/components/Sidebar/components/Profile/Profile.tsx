import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography, Theme } from '@material-ui/core';
import { User } from 'auth';
import { connect } from 'react-redux';
import { setUser } from 'redux/actions';
import { RootStateType } from 'redux/reducers';
import { GoogleLogout } from 'react-google-login';
import { GOOGLE_CLIENT_ID } from 'config';
import { PointLogin } from 'components';

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

  const signOut = () => {
    props.setUser(undefined);
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
        <PointLogin />
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
