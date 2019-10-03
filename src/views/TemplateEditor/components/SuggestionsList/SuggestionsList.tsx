import React from 'react';
import { Theme, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { PrometheusSuggestion } from 'models/prometheus';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
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
  className?: string;

  groups: Array<{
    name: string;
    items?: PrometheusSuggestion[];
  }>;

  selectedItem?: PrometheusSuggestion;

  onItemSelected?: (item: PrometheusSuggestion) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class SuggestionsList extends React.Component<PropsType, State> {
  public render() {
    const {
      classes,
      className,
      groups,
      selectedItem,
      onItemSelected
    } = this.props;

    return (
      <List className={clsx(classes.root, className)} subheader={<li />}>
        {groups.map(group => (
          <li key={`section-${group.name}`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={classes.listSubheader}>{group.name}</ListSubheader>
              {group.items && group.items.map(i => (
                <ListItem
                  button
                  key={i.text}
                  selected={i === selectedItem}
                  onClick={() => onItemSelected && onItemSelected(i)}
                >
                  <ListItemText
                    primary={i.text}
                  />
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(SuggestionsList);
