import { makeStyles, Paper, Tabs } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    // flexGrow: 1,
  },
});

interface Props {
  activeTab: number;
  onChange: (activeTab: number) => void;
}

const TabMenu: React.SFC<Props> = (props) => {
  const classes = useStyles();

  function onChange(_: React.ChangeEvent<{}>, value: any) {
    props.onChange(value);
  }

  return (
    <Paper className={classes.root} square>
      <Tabs
        value={props.activeTab}
        onChange={onChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        centered
      >
        {props.children}
      </Tabs>
    </Paper>
  );
};

export default TabMenu;