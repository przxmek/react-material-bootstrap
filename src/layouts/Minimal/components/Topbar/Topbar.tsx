import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
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
  }
}));

interface Props {
  className?: string;
}

const Topbar: React.FunctionComponent<Props> = props => {
  const { className } = props;

  const classes = useStyles();

  return (
    <AppBar
      className={clsx(classes.root, className)}
      color="primary"
      position="fixed"
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            className={classes.logo}
            alt="Point."
            src="/images/logos/point-logo.svg"
          />
          <Typography
            className={classes.logoDashboardText}
            variant="h2"
            display="inline"
          >
            Admin Dashboard
          </Typography>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
