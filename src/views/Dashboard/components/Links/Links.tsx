import React from 'react';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Theme, CardActionArea } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1)
  },
  caption: {}
});

interface Props {
  className?: string;
}

type PropsType = Props & WithStyles<typeof styles>;


class Links extends React.Component<PropsType> {
  public render() {
    const { classes, className, ...rest } = this.props;

    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardActionArea>
          <CardContent>
            <Grid
              container
              justify="space-between"
            >
              <Grid item>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                >
                  LINKS
              </Typography>
                <Typography variant="h3">$24,000</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(Links);
