import { Theme, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import { Snippet, HandwrittenEmail, Template } from 'models/snippetGenerator';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.palette.background.paper,
    // position: 'relative',
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
  handwrittenEmails: HandwrittenEmail[];
  snippets: Snippet[];
  templates: Template[];
  onItemSelected: (item: any) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class SnippetsList extends React.Component<PropsType, State> {

  public render() {
    const { classes, className, handwrittenEmails, snippets, templates, onItemSelected } = this.props;

    return (
      <List className={clsx(classes.root, className)} subheader={<li />}>
        <li key={`section-snippets`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Snippets`}</ListSubheader>
            {snippets.map(s => (
              <ListItem button key={`item-snippets-${s.snippet}`} onClick={() => onItemSelected(s)}>
                <ListItemText primary={s.snippet} />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-templates`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Templates`}</ListSubheader>
            {templates.map(t => (
              <ListItem button key={`item-templates-${t}`} onClick={() => onItemSelected(t)}>
                <ListItemText primary={t} />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-handwrittenEmails`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Handwritten emails`}</ListSubheader>
            {handwrittenEmails.map(h => (
              <ListItem button key={`item-handwrittenEmails-${h}`} onClick={() => onItemSelected(h)}>
                <ListItemText primary={h} />
              </ListItem>
            ))}
          </ul>
        </li>
      </List>
    );
  }
}

export default withStyles(styles)(SnippetsList);
