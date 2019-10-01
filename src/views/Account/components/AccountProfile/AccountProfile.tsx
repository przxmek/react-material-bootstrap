import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  Theme,
  TextField,
  IconButton,
  Box,
  Tooltip
} from '@material-ui/core';
import User from 'models/user';
import AddIcon from '@material-ui/icons/AddBox';
import { showAlert } from 'components';
import { addPremiumDays } from 'api/users';


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
  progress: {
    marginTop: theme.spacing(2)
  },
  marginRight: {
    marginRight: theme.spacing(2)
  },
  userInfoText: {},
});

interface Props {
  className?: string;
  account: User;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
  premiumDaysInput: string;
}

class AccountProfile extends React.Component<PropsType, State> {
  public state: State = {
    premiumDaysInput: '14'
  };

  private changePremiumDays = (premiumDaysInput: string) => {
    const parsed = parseInt(premiumDaysInput, 10);
    if (parsed >= 0) {
      this.setState({ premiumDaysInput });
    }
  }

  private addPremiumDays = async () => {
    const { premiumDaysInput } = this.state;
    const emailAddress = this.props.account.email_address;

    const premiumDays = parseInt(premiumDaysInput, 10);

    if (premiumDays > 0) {
      try {
        await addPremiumDays(emailAddress, premiumDays);
      } catch (e) {
        showAlert("error", e.message, 10000);
      }
    } else {
      showAlert("error", "Number of days must be greater than 0.", 10000);
    }
  }

  public render() {
    const { classes, className, account } = this.props;
    const { premiumDaysInput } = this.state;

    return (
      <Card className={clsx(classes.root, className)}>
        <CardContent>
          <div className={classes.details}>
            <div>
              <Typography
                gutterBottom
                variant="h4"
              >
                {account.email_address}
              </Typography>
              <Typography
                className={classes.userInfoText}
                color="textSecondary"
                variant="body1"
              >
                {account.active ? "Active" : "Inactive"}{" "}{account.membership_type}{" user"}
              </Typography>
            </div>
            <Avatar
              className={classes.avatar}
              src='/images/avatars/anonymous-user.png'
            />
          </div>
          <Divider />
          {/* <div className={classes.progress}>
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
              <IconButton onClick={() => this.addPremiumDays()}>
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
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountProfile);
