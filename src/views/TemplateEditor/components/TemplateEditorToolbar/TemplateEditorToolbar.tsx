import { Button, Theme, Tooltip } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

const styles = (theme: Theme) => createStyles({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  marginRight: {
    marginRight: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  },
});

interface Props {
  className?: string;
  onGenerateSnippets: () => void;
  onGenerateTemplates: () => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class TemplateEditorToolbar extends React.Component<PropsType, State> {

  public render() {
    const { classes, className, onGenerateSnippets, onGenerateTemplates } = this.props;

    return (
      <div className={clsx(classes.root, className)}>
        <div className={classes.row}>
          <span className={classes.spacer} />

          <Tooltip title="Generate templates using snippet-generator">
            <Button
              variant="contained"
              className={classes.marginRight}
              onClick={onGenerateSnippets}
            >
              Generate snippets
            </Button>
          </Tooltip>

          <Tooltip title="Generate templates using snippet-generator">
            <Button
              variant="contained"
              className={classes.marginRight}
              onClick={onGenerateTemplates}
            >
              Generate templates
            </Button>
          </Tooltip>

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateEditorToolbar);
