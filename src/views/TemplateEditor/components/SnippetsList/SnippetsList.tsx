import { Theme, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

import { ItemType } from 'views/TemplateEditor/TemplateEditor';

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
  handwrittenEmails: string[];
  snippets: string[];
  templates: string[];
  onItemSelected: (item: string, type: ItemType) => void;
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
            {snippets.map((s, idx) => (
              <ListItem button key={`item-snippets-${idx}`} onClick={() => onItemSelected(s, 'snippet')}>
                <ListItemText primary={s} />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-templates`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Templates`}</ListSubheader>
            {templates.map((t, idx) => (
              <ListItem button key={`item-templates-${idx}`} onClick={() => onItemSelected(t, 'template')}>
                <ListItemText primary={t} />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-handwrittenEmails`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Handwritten emails`}</ListSubheader>
            {handwrittenEmails.map((h, idx) => (
              <ListItem button key={`item-handwrittenEmails-${idx}`} onClick={() => onItemSelected(h, 'handwrittenEmail')}>
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
