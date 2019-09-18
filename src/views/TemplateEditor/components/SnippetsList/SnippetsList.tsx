import { Theme, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

import { Template, PrometheusTemplate } from 'models/templates';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
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

  prometheusSnippets?: PrometheusTemplate[];

  selectedItem?: Template;

  onItemSelected: (item: Template) => void;
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
      prometheusSnippets,
      selectedItem,
      onItemSelected
    } = this.props;

    return (
      <List className={clsx(classes.root, className)} subheader={<li />}>
        <li key={`section-prometheusSnippets`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Prometheus snippets`}</ListSubheader>
            {prometheusSnippets && prometheusSnippets.map(i => (
              <ListItem
                button
                key={i.trigger}
                selected={i === selectedItem}
                onClick={() => onItemSelected(i)}
              >
                <ListItemText
                  primary={i.trigger}
                  secondary={<div dangerouslySetInnerHTML={{ __html: i.text }} />}
                />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-templatesWithVars`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Templates with vars`}</ListSubheader>
            {templatesWithVars && templatesWithVars.map(i => (
              <ListItem
                button
                key={i.trigger}
                selected={i === selectedItem}
                onClick={() => onItemSelected(i)}
              >
                <ListItemText
                  primary={i.trigger}
                  secondary={<div dangerouslySetInnerHTML={{ __html: i.text }} />}
                />
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
                onClick={() => onItemSelected(i)}
              >
                <ListItemText
                  primary={i.trigger}
                  secondary={<div dangerouslySetInnerHTML={{ __html: i.text }} />}
                />
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
                onClick={() => onItemSelected(i)}
              >
                <ListItemText
                  primary={i.trigger}
                  secondary={<div dangerouslySetInnerHTML={{ __html: i.text }} />}
                />
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
                onClick={() => onItemSelected(i)}
              >
                <ListItemText
                  primary={i.trigger}
                  secondary={<div dangerouslySetInnerHTML={{ __html: i.text }} />}
                />
              </ListItem>
            ))}
          </ul>
        </li>

        <li key={`section-snippets`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listSubheader}>{`Paragraph snippets`}</ListSubheader>
            {paragraphSnippets && paragraphSnippets.map(i => (
              <ListItem
                button
                key={i.trigger}
                selected={i === selectedItem}
                onClick={() => onItemSelected(i)}
              >
                <ListItemText
                  primary={i.trigger}
                  secondary={<div dangerouslySetInnerHTML={{ __html: i.text }} />}
                />
              </ListItem>
            ))}
          </ul>
        </li>
      </List>
    );
  }
}

const SnippetText: React.SFC<{ text: string }> = (props) => {
  const { text } = props;
  return (
    <div>{text}</div>
  );
};

export default withStyles(styles)(SnippetsList);
