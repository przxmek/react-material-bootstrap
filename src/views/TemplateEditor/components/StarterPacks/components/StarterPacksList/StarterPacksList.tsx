import React from 'react';
import {
  Theme,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox
} from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { StarterPack } from 'models/googleSheets';

const styles = (theme: Theme) => createStyles({
  root: {
    minWidth: 240,
    maxWidth: 240,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    wordWrap: 'break-word',
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
  onItemSelected: (item: StarterPack) => void;
  onStarterPackToggle: (selectedStarterPacks: string) => void;
  selectedItem?: StarterPack;
  selectedStarterPacks: string[];
  starterPacks?: StarterPack[];
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class StarterPacksList extends React.Component<PropsType, State> {
  public render() {
    const {
      classes,
      selectedItem,
      selectedStarterPacks,
      starterPacks,
      onItemSelected,
      onStarterPackToggle
    } = this.props;

    if (!starterPacks) {
      return null;
    }

    return (
      <List dense className={classes.root}>
        {starterPacks.map(starterPack => (
          <ListItem
            button
            key={starterPack.name}
            selected={starterPack === selectedItem}
            onClick={() => onItemSelected(starterPack)}
          >
            <ListItemText id={starterPack.name} primary={starterPack.name} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={() => onStarterPackToggle(starterPack.name)}
                checked={selectedStarterPacks.indexOf(starterPack.name) !== -1}
                inputProps={{ 'aria-labelledby': starterPack.name }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(StarterPacksList);
