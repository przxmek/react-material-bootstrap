import React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { Grid, Theme } from '@material-ui/core';
import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders
} from './components';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(4)
  }
});

type PropsType = WithStyles<typeof styles>;

class Dashboard extends React.Component<PropsType> {
  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalUsers />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TasksProgress />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestSales />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <UsersByDevice />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
