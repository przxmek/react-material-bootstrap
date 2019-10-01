import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery, Theme } from '@material-ui/core';
import { Sidebar, Topbar, Footer } from './components';
import { Auth, User } from 'auth';
import { RootStateType } from 'redux/reducers';
import { connect } from 'react-redux';
import { setUser } from 'redux/actions';
import sendAuthResponse from 'api/auth';
import { showAlert } from 'components';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
}));

interface Props {
  user?: User;
  setUser: (user?: User) => void;
}

const Main: React.SFC<Props> = (props) => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme<Theme>();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleOnAuth = async (auth: Auth) => {
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

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar
        onAuth={handleOnAuth}
        onSidebarOpen={handleSidebarOpen}
      />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
        <Footer />
      </main>
    </div>
  );
};

const mapStateToProps = (state: RootStateType) => {
  return { user: state.user };
};

const dispatchProps = {
  setUser
};

export default connect(
  mapStateToProps,
  dispatchProps
)(Main);
