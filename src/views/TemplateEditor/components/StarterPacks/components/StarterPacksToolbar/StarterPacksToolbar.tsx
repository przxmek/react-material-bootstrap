import { Button, Theme, Tooltip, CircularProgress } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import { green } from '@material-ui/core/colors';

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
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

interface Props {
  className?: string;
  emailAddress: string;
  onApplyAll?: () => void;
  onRefresh?: () => void;
  saving: boolean;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class StarterPacksToolbar extends React.Component<PropsType, State> {

  public render() {
    const {
      classes,
      className,
      emailAddress,
      onApplyAll,
      onRefresh,
      saving
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

          <div className={classes.wrapper}>
            <Tooltip title={`Apply selected starter packs to ${emailAddress} user account`}>
              <Button
                variant="contained"
                color="primary"
                className={classes.marginRight}
                onClick={onApplyAll}
                disabled={!onApplyAll || saving}
              >
                Apply starter packs
            </Button>
            </Tooltip>
            {saving && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(StarterPacksToolbar);
