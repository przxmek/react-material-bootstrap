import React from 'react';
import { Theme, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { StarterPack } from 'models/googleSheets';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    wordWrap: 'break-word',
    marginBottom: theme.spacing(4),
  },
  listSubheader: {
    fontSize: theme.typography.pxToRem(24),
    fontWeight: theme.typography.fontWeightBold,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
});

interface Props {
  starterPack?: StarterPack;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class StarterPackDetails extends React.Component<PropsType, State> {
  public render() {
    const {
      classes,
      starterPack,
    } = this.props;

    if (!starterPack) {
      return null;
    }

    if (starterPack.snippets.length === 0) {
      return (
        <List className={classes.root}>
          <ListItem>
            <ListItemText
              primary={
                <Typography color="error">
                  Chosen starter pack is empty（　ﾟДﾟ) but here's a Pikachu for you!
                </Typography>
              }
              secondary={
                <p><br /><br />
                  █▀▀▄░░░░░░░░░░░▄▀▀█<br />
                  ░█░░░▀▄░▄▄▄▄▄░▄▀░░░█<br />
                  ░░▀▄░░░▀░░░░░▀░░░▄▀<br />
                  ░░░░▌░▄▄░░░▄▄░▐▀▀<br />
                  ░░░▐░░█▄░░░▄█░░▌▄▄▀▀▀▀█ #Pikachu<br />
                  ░░░▌▄▄▀▀░▄░▀▀▄▄▐░░░░░░█<br />
                  ▄▀▀▐▀▀░▄▄▄▄▄░▀▀▌▄▄▄░░░█<br />
                  █░░░▀▄░█░░░█░▄▀░░░░█▀▀▀<br />
                  ░▀▄░░▀░░▀▀▀░░▀░░░▄█▀<br />
                  ░░░█░░░░░░░░░░░▄▀▄░▀▄<br />
                  ░░░█░░░░░░░░░▄▀█░░█░░█<br />
                  ░░░█░░░░░░░░░░░█▄█░░▄▀<br />
                  ░░░█░░░░░░░░░░░████▀<br />
                  ░░░▀▄▄▀▀▄▄▀▀▄▄▄█▀<br />
                </p>
              }
            />
          </ListItem>
        </List >
      );
    }

    return (
      <List className={classes.root}>
        {starterPack.snippets && starterPack.snippets.map(snippet => (
          <ListItem
            button
            divider
            key={snippet.trigger}
          >
            <ListItemText
              primary={snippet.trigger}
              secondary={<div dangerouslySetInnerHTML={{ __html: snippet.text }} />}
            />
          </ListItem>
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(StarterPackDetails);
