import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer, Theme } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/HelpOutline';

import {
  Profile,
  SidebarNav
} from './components';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

interface Props {
  className?: string;
  onClose?: () => void;
  open: boolean;
  variant: 'permanent' | 'persistent' | 'temporary';
}

const Sidebar: React.SFC<Props> = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Dashboard',
      to: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'Users',
      to: '/users',
      icon: <PeopleIcon />
    },
    {
      title: 'Products',
      to: '/products',
      icon: <ShoppingBasketIcon />
    },
    {
      title: 'Account',
      to: '/account/',
      icon: <AccountBoxIcon />
    },
    {
      title: 'Settings',
      to: '/settings',
      icon: <SettingsIcon />
    },
    {
      title: 'Help',
      href: 'https://easyemail.atlassian.net/wiki/spaces/GEN/pages/337739836/Admin+Dashboard',
      icon: <HelpIcon />
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

export default Sidebar;
