
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography
} from '@material-ui/core';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';

import getGoogleSheetsUserData from 'api/googleSheets';
import { showAlert } from 'components';
import { WaitlistSpreadsheet } from 'models/googleSheets';

const styles = (theme: Theme) => createStyles({
  root: {},
  buttonMargin: {
    margin: theme.spacing(0.5),
  },
  progress: {
    marginLeft: "auto",
    marginRight: theme.spacing(1)
  },
  inner: {
    minWidth: 800
  },
  tableBox: {
    marginBottom: theme.spacing(4),
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
});

interface Props {
  className?: string;
  emailAddress: string;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  data?: WaitlistSpreadsheet;
  empty?: boolean;
  loading: boolean;
}

class WaitlistSheet extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
      data: undefined,
      empty: undefined,
      loading: true,
    };
  }

  public async componentDidMount() {
    await this.reloadGoogleSheetsData();
  }

  private reloadGoogleSheetsData = async () => {
    const { emailAddress } = this.props;
    this.setState({ loading: true });
    try {
      const data = await getGoogleSheetsUserData(emailAddress);
      const empty = this.isEmpty(data);
      this.setState({ data, empty, loading: false });
    } catch (e) {
      showAlert("error", e.message, 10000);
      this.setState({ loading: false });
    }
  }

  private isEmpty = (data: WaitlistSpreadsheet) => {
    if (data["NPS score"].length > 1
      || data["Onboarding call"].length > 1
      || data["Onboarding survey"].length > 1
      || data["Team signups"].length > 1
      || data["Uninstall form"].length > 1) {
      return false;
    }

    return true;
  }

  private renderDataTable(data: string[][]) {
    const { classes } = this.props;

    return (
      <PerfectScrollbar>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                {data[0].map(t =>
                  <TableCell key={t}>{t}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(1).map((row, index) => (
                <TableRow hover key={index}>
                  {row.map(t =>
                    <TableCell key={t}>{t}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PerfectScrollbar>
    );
  }

  private renderSheetsData() {
    const { classes, emailAddress } = this.props;
    const { data, empty, loading } = this.state;

    if (!data) {
      if (loading) {
        return (
          <Typography variant="body1" color="textSecondary">
            Loading data for {emailAddress}..
          </Typography>
        );
      } else {
        return (
          <Typography variant="body1" color="error">
            Failed to load data for {emailAddress}. Check if you're sgined in. Try re-signing in.
          </Typography>
        );
      }
    }

    if (empty) {
      return (
        <Typography variant="body1" color="textSecondary">
          No data for {emailAddress}.
        </Typography>
      );
    }

    return Object.entries(data).map(([key, value]) =>
      value.length > 1
        ? (
          <Box
            className={classes.tableBox}
            key={key}
          >
            <Typography
              variant="h4"
              gutterBottom
            >
              {key}
            </Typography>
            {this.renderDataTable(value)}
          </Box>
        ) : (
          <div key={key} />
        )
    );
  }

  public render() {
    const { classes, className } = this.props;
    const { loading } = this.state;

    return (
      <Card className={clsx(classes.root, className)}>
        <form
          autoComplete="off"
          noValidate
        >
          <CardHeader
            title="Waitlist Google Sheet"
            subheader="See user's data from Google Sheet 'Waitlist'"
          />
          <Divider />
          <CardContent>
            {this.renderSheetsData()}
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => this.reloadGoogleSheetsData()}
            >
              Refresh
            </Button>
            <Button
              color="primary"
              variant="outlined"
              href="https://docs.google.com/spreadsheets/d/1w5XYng5OGsbHQDhnDyghy6T2BusTbO9TmK73s7IveOo/edit?usp=sharing"
              target="blank"
            >
              Open in Google Sheets
            </Button>
            {loading && (<CircularProgress size={28} className={classes.progress} />)}
          </CardActions>
        </form>
      </Card>
    );
  }
}

export default withStyles(styles)(WaitlistSheet);
