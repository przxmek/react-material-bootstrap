import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Divider,
  Button,
  Theme,
  TextField,
  IconButton,
  Box,
  Tooltip,
  CircularProgress
} from '@material-ui/core';
import User from 'models/user';
import AddIcon from '@material-ui/icons/AddBox';
import { showAlert } from 'components';
import { addPremiumDays } from 'api/users';
import moment from 'moment';


const styles = (theme: Theme) => createStyles({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 60,
    width: 60,
    flexShrink: 0,
    flexGrow: 0
  },
  daysBox: {
    marginTop: theme.spacing(1),
  },
  daysText: {
    marginRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  daysInput: {
    width: 150,
  },
  onboardingProgress: {
    marginTop: theme.spacing(2)
  },
  marginRight: {
    marginRight: theme.spacing(2)
  },
  progress: {
    marginLeft: "auto",
    marginRight: theme.spacing(1)
  },
});

interface Props {
  className?: string;
  account: User;
  onAccountUpdate: () => void;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  loading: boolean;
  premiumDaysInput: string;
}

class AccountProfile extends React.Component<PropsType, State> {
  public state: State = {
    loading: false,
    premiumDaysInput: '14'
  };

  private changePremiumDays = (premiumDaysInput: string) => {
    const parsed = parseInt(premiumDaysInput, 10);
    if (parsed >= 0) {
      this.setState({ premiumDaysInput });
    }
  }

  private savePremiumDays = async () => {
    const { premiumDaysInput } = this.state;
    const { account, onAccountUpdate } = this.props;

    const premiumDays = parseInt(premiumDaysInput, 10);

    if (premiumDays > 0) {
      try {
        this.setState({ loading: true });
        await addPremiumDays(account, premiumDays);
        showAlert("success", "Updated user's premium period!");
        onAccountUpdate();
      } catch (e) {
        showAlert("error", e.message, 10000);
      } finally {
        this.setState({ loading: false });
      }
    } else {
      showAlert("error", "Number of days must be greater than 0.", 10000);
    }
  }

  public render() {
    const { classes, className, account } = this.props;
    const { loading, premiumDaysInput } = this.state;

    return (
      <Card className={clsx(classes.root, className)}>
        <CardContent>
          <div className={classes.details}>
            <div>
              <Typography gutterBottom variant="h4">
                {account.email_address}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {account.active ? "Active" : "Inactive"}{" "}{account.membership_type}{" user"}
              </Typography>
              {account.membership_type === "premium" && account.active_until && (
                <Typography color="textSecondary" variant="body1">
                  {`Active until ${moment(account.active_until).format('llll')}`}
                </Typography>
              )}
            </div>
            {/* <Avatar
              className={classes.avatar}
              src='/images/avatars/anonymous-user.png'
            /> */}
          </div>
        </CardContent>
        <Divider />
        <CardContent>
          {/* <div className={classes.onboardingProgress}>
              <Typography variant="body1">Onboarding Completeness: 70%</Typography>
              <LinearProgress
                value={70}
                variant="determinate"
              />
            </div> */}
          <Box
            className={classes.daysBox}
            display="flex"
            alignItems="flex-end"
          >
            <Typography
              className={classes.daysText}
              variant="body1"
              color="textPrimary"
            >
              Add premium:
            </Typography>
            <TextField
              label="Number of days"
              className={classes.daysInput}
              value={premiumDaysInput}
              onChange={(e) => this.changePremiumDays(e.target.value)}
              type="number"
              margin="dense"
            />
            <Tooltip title="Add premium for this user">
              <IconButton onClick={() => this.savePremiumDays()}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="text"
            className={classes.marginRight}
            component={RouterLink}
            to={`/template-editor/${account.email_address}`}
          >
            Templates
          </Button>
          {loading && (<CircularProgress size={28} className={classes.progress} />)}
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountProfile);
