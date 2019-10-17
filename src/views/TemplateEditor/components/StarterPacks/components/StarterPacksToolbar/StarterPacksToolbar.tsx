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
  onRefresh?: () => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class StarterPacksToolbar extends React.Component<PropsType, State> {

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

  public render() {
    const {
      classes,
      className,
      emailAddress,
      onApplyAll,
      onRefresh
    } = this.props;

    return (
      <div className={clsx(classes.root, className)}>
        <div className={classes.row}>
          <span className={classes.spacer} />

          <Tooltip title={`Open the source Spreadsheet directly in Google Sheets`}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.marginRight}
              href="https://docs.google.com/spreadsheets/d/1dpbzSEpup6cnDPf_zu9vJOWA-tCtfV0wjViKgaz1U4Q/edit?usp=sharing"
              target="blank"
            >
              Open in Google Sheets
            </Button>
          </Tooltip>


          {onRefresh && (
            <Tooltip title={`Reload starter packs data (current selection will be lost)`}>
              <Button
                variant="outlined"
                color="primary"
                className={classes.marginRight}
                onClick={onRefresh}
              >
                Refresh
              </Button>
            </Tooltip>
          )}

          <Tooltip title={`Apply selected starter packs to ${emailAddress} user account`}>
            <Button
              variant="contained"
              color="primary"
              className={classes.marginRight}
              onClick={onApplyAll}
              disabled={!onApplyAll}
            >
              Apply starter packs
            </Button>
          </Tooltip>

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(StarterPacksToolbar);
