import { Theme, CircularProgress, Typography, Box, Fade } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';

const styles = (theme: Theme) => createStyles({
  root: {
    height: "calc(100% - 64px)",
  },
  progress: {
    margin: theme.spacing(4),
  },
});

interface Props {
}
type PropsType = Props & WithStyles<typeof styles>;

interface State {
  showText: boolean;
}

class Loading extends React.Component<PropsType, State> {
  public state = {
    showText: false,
  };

  public componentDidMount() {
    const delayMs = 1000;
    setTimeout(() => {
      this.setState({ showText: true });
    }, delayMs);
  }

  public render() {
    const { classes } = this.props;
    const { showText } = this.state;

    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        flexShrink={1}
        flexBasis="auto"
      >
        <Fade in>
          <CircularProgress className={classes.progress} />
        </Fade>
        <Fade in={showText}>
          <Typography variant="h1">
            <span role="img" aria-label="coffee" >☕</span>
            {" Loading.."}
          </Typography>
        </Fade>
      </Box>
    );
  }
}

export default withStyles(styles)(Loading);
