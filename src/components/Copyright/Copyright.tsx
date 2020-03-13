import React from 'react';
import { Typography, Link } from '@material-ui/core';

const Copyright: React.FunctionComponent = () => {

  const currentYear = () => new Date().getFullYear();

  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        React Material Bootstrap
      </Link>{' '}
      {currentYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;