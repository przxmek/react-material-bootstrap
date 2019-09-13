import { Theme, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

import { Template } from 'models/snippetGenerator';
import { TemplateType } from 'api/snippetGenerator';

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
  templatesWithVars?: Template[];
  templates?: Template[];
  potentialTemplatesWithVars?: Template[];
  potentialTemplates?: Template[];
  paragraphSnippets?: Template[];
  selectedItem?: Template;
  onItemSelected: (item: Template, type: TemplateType) => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class SnippetsList extends React.Component<PropsType, State> {

  public render() {
    const {
      classes,
      className,
      templatesWithVars,
      templates,
      potentialTemplatesWithVars,
      potentialTemplates,
      paragraphSnippets,
      selectedItem,
      onItemSelected
    } = this.props;

    return (
      <List className={clsx(classes.root, className)} subheader={<li />}>
        <li key={`section-templatesWithVars`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Templates with vars`}</ListSubheader>
            {templatesWithVars && templatesWithVars.map(i => (
              <ListItem
                button
                key={i.trigger}
                selected={i === selectedItem}
                onClick={() => onItemSelected(i, 'templates_with_vars')}
              >
                <ListItemText primary={i.trigger} secondary={i.snippet} />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-templates`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Templates`}</ListSubheader>
            {templates && templates.map(i => (
              <ListItem
                button
                key={i.trigger}
                selected={i === selectedItem}
                onClick={() => onItemSelected(i, 'templates')}
              >
                <ListItemText primary={i.trigger} secondary={i.snippet} />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-potentialTemplatesWithVars`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Potential templates with vars`}</ListSubheader>
            {potentialTemplatesWithVars && potentialTemplatesWithVars.map(i => (
              <ListItem
                button
                key={i.trigger}
                selected={i === selectedItem}
                onClick={() => onItemSelected(i, 'potential_templates_with_vars')}
              >
                <ListItemText primary={i.trigger} secondary={i.snippet} />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-potentialTemplates`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Potential templates`}</ListSubheader>
            {potentialTemplates && potentialTemplates.map(i => (
              <ListItem
                button
                key={i.trigger}
                selected={i === selectedItem}
                onClick={() => onItemSelected(i, 'potential_templates')}
              >
                <ListItemText primary={i.trigger} secondary={i.snippet} />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-snippets`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Paragraph Snippets`}</ListSubheader>
            {paragraphSnippets && paragraphSnippets.map(i => (
              <ListItem
                button
                key={i.trigger}
                selected={i === selectedItem}
                onClick={() => onItemSelected(i, 'paragraph_snippets')}
              >
                <ListItemText primary={i.trigger} secondary={i.snippet} />
              </ListItem>
            ))}
          </ul>
        </li>
      </List>
    );
  }
}

export default withStyles(styles)(SnippetsList);
