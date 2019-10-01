import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography, Theme } from '@material-ui/core';
import { User } from 'auth';
import { RootStateType } from 'redux/reducers';
import { connect } from 'react-redux';

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
  }
}));

interface Props {
  className?: string;
  user?: User;
}

const Profile: React.SFC<Props> = props => {
  const { className, user } = props;

  const classes = useStyles();

  const defaultUser = {
    name: 'Unauthenticated',
    avatar: '/images/avatars/anonymous-user.png'
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
    </div>
  );
};

const mapStateToProps = (state: RootStateType) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps
)(Profile);
