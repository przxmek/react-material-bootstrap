import React from 'react';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  Theme,
  Typography,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import Contact from 'models/mailjet/contact';
import { changeContactStage, fetchMailjetContact } from 'api/mailjet';
import { showAlert } from 'components';
import { getContactStage } from 'models/mailjet/mailjet';

const styles = (theme: Theme) => createStyles({
  root: {},
  buttonMargin: {
    margin: theme.spacing(0.5),
  },
  progress: {
    marginLeft: "auto",
    marginRight: theme.spacing(1)
  },
});

interface Props {
  className?: string;
  emailAddress: string;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  contact?: Contact;
  loading: boolean;
}

class AccountDetails extends React.Component<PropsType, State> {

  constructor(props: PropsType) {
    super(props);

    this.state = {
      contact: undefined,
      loading: true,
    };
  }

  public componentDidMount = async () => {
    await this.reloadMailjetContact();
  }

  private reloadMailjetContact = async () => {
    const { emailAddress } = this.props;
    this.setState({ loading: true });
    try {
      const contact = await fetchMailjetContact(emailAddress);
      this.setState({ loading: false, contact });
    } catch (e) {
      showAlert("error", e.message, 10000);
      this.setState({ loading: false });
    }
  }

  private changeMailjetStage = async (stage: string) => {
    const { emailAddress } = this.props;

    showAlert("info", "Processing...", 5000);
    try {
      await changeContactStage(emailAddress, stage);
      showAlert("success", "Mailjet stage changed.", 5000);
    } catch (e) {
      showAlert("error", `Failed to change mailjet stage: ${e.message}`, 10000);
    } finally {
      await this.reloadMailjetContact();
    }
  }

  private renderMailjetStageButtons() {
    const { classes } = this.props;
    const { contact, loading } = this.state;

    const stages: Array<{ key: string; name: string; desc: string }> = [
      // { key: "new_signup", name: "New signup", desc: "Signed up for the waitlist" },
      { key: "onboarding", name: "Onboarding", desc: "We wanna onboard you" },
      { key: "onboarding_survey_received", name: "Onboarding survey received", desc: "We received your survey" },
      { key: "scheduling_onboarding", name: "Scheduling onboarding", desc: "We wanna schedule an onboarding call" },
      { key: "onboarding_completed", name: "Onboarding completed", desc: "After call follow up" },
    ];

    if (!contact && !loading) {
      return (
        <Button disabled variant="text" size="small">
          Missing Mailjet Contact
        </Button>
      );
    }

    const currentStage = contact ? getContactStage(contact) : undefined;

    return stages.map(stage => (
      <Tooltip
        title={`${stage.desc} (${stage.key})`}
        key={stage.key}
      >
        <Button
          color="secondary"
          variant={currentStage && currentStage.key === stage.key ? "contained" : "outlined"}
          size="small"
          className={classes.buttonMargin}
          onClick={() => this.changeMailjetStage(stage.key)}
        >
          {stage.name}
        </Button>
      </Tooltip>
    ));
  }

  public render() {
    const { classes, className } = this.props;
    const { loading, contact } = this.state;

    const stage = contact ? getContactStage(contact) : undefined;

    return (
      <Card className={clsx(classes.root, className)}>
        <form
          autoComplete="off"
          noValidate
        >
          <CardHeader
            title="Mailjet"
            subheader="Manage oboarding stage on Mailjet"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <Typography variant="h4" gutterBottom>
                  {"Current stage"}
                </Typography>
                {stage && (<>
                  <Typography variant="h2" color="textSecondary">
                    {stage.name}
                  </Typography>
                  <Typography variant="subtitle1">
                    {`${stage.desc} (${stage.key})`}
                  </Typography>
                </>)}
                {!stage && !loading && (
                  <Typography
                    variant="h2"
                    color="textSecondary"
                  >
                    Unknown stage (stage missing)
                  </Typography>
                )}
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography variant="h4" gutterBottom>
                  {"Change stage"}
                </Typography>
                {this.renderMailjetStageButtons()}
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => this.reloadMailjetContact()}
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

export default withStyles(styles)(AccountDetails);
