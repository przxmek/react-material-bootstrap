import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Typography, Theme } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';

const styles = (theme: Theme) => createStyles({
  root: {
    boxShadow: 'none'
  },
  logo: {
    height: '36px',
    display: 'inline-block'
  },
  logoDashboardText: {
    color: theme.palette.text.hint,
    marginLeft: theme.spacing(),
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
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  notifications: any[];
}

class Topbar extends React.Component<PropsType, State> {

  public state = {
    notifications: [],
  };

  public render() {
    const { className, classes, onSidebarOpen } = this.props;
    const { notifications } = this.state;

    return (
      <AppBar className={clsx(classes.root, className)}>
        <Toolbar>
          <RouterLink to="/">
            <img
              className={classes.logo}
              alt="React Material Bootstrap Logo"
              src="/images/logos/logo--white.svg"
            />
            <Typography
              className={classes.logoDashboardText}
              color="textPrimary"
              variant="h2"
              display="inline"
            >
              React Material Bootstrap
            </Typography>
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
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Topbar);
