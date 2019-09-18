import { Theme, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import { PrometheusTemplate } from 'models/templates';


const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 800,
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
  snippets: PrometheusTemplate[];
  selectedItem?: PrometheusTemplate;
  onItemSelected: (item: PrometheusTemplate) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class SnippetsList extends React.Component<PropsType, State> {

  public render() {
    const {
      classes,
      className,
      snippets,
      selectedItem,
      onItemSelected
    } = this.props;

    return (
      <List className={clsx(classes.root, className)} subheader={<li />}>
        <li key={`section-snippets`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Snippets`}</ListSubheader>
            {snippets.map(i => (
              <ListItem
                button
                key={i.trigger}
                selected={i === selectedItem}
                onClick={() => onItemSelected(i)}
              >
                <ListItemText primary={i.trigger} secondary={i.text} />
              </ListItem>
            ))}
          </ul>
        </li>
      </List>
    );
  }
}

export default withStyles(styles)(SnippetsList);
