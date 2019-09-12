import { Button, Theme, Tooltip } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import { SNIPPET_GENERATOR_URL, SNIPPET_GENERATOR_PASS, SNIPPET_GENERATOR_USER } from 'config';

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
  emailAddress: string;
  onApplyAll?: () => void;
  onGenerateTemplates: () => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class TemplateEditorToolbar extends React.Component<PropsType, State> {

  private downloadCSVs = async () => {
    const { emailAddress } = this.props;

    const files = [
      "templates",
      "templates_with_vars",
      "potential_templates",
      "potential_templates_with_vars",
      "paragraph_snippets"
    ];

    for (const type of files) {
      const url = `${SNIPPET_GENERATOR_URL}/snippets/${emailAddress}/${type}?csv`;
      const authUrl = url.replace("://", `://${SNIPPET_GENERATOR_USER}:${SNIPPET_GENERATOR_PASS}@`);
      window.open(authUrl);
    }
  }

  private delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public render() {
    const {
      classes,
      className,
      onApplyAll,
      onGenerateTemplates
    } = this.props;

    return (
      <div className={clsx(classes.root, className)}>
        <div className={classes.row}>
          <span className={classes.spacer} />

          <Tooltip title="Generate templates using snippet-generator">
            <Button
              variant="contained"
              className={classes.marginRight}
              onClick={onGenerateTemplates}
            >
              Generate templates
            </Button>
          </Tooltip>

          <Tooltip title="Download CSV files">
            <Button
              variant="contained"
              className={classes.marginRight}
              onClick={this.downloadCSVs}
            >
              Download CSV files
            </Button>
          </Tooltip>

          <Tooltip title="Apply all snippets to Prometheus profile">
            <Button
              variant="contained"
              color="primary"
              className={classes.marginRight}
              onClick={onApplyAll}
              disabled={!onApplyAll}
            >
              Apply all
            </Button>
          </Tooltip>

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateEditorToolbar);
