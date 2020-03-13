import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { Copyright } from 'components';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4)
  }
}));

interface Props {
  className?: string;
}

const Footer: React.SFC<Props> = props => {
  const { className } = props;

  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Copyright />
    </div>
  );
};

export default Footer;
