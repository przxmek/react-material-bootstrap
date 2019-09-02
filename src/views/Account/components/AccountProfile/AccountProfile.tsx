import React from 'react';
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
  LinearProgress,
  Theme
} from '@material-ui/core';
import User from 'models/user';

const styles = (theme: Theme) => createStyles({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  },
  userInfoText: {},
});

interface Props {
  className?: string;
  account?: User;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class AccountProfile extends React.Component<PropsType, State> {

  public render() {
    const { classes, className, account, ...rest } = this.props;

    if (!account) {
      return (
        <h1>Loading..</h1>
      );
    }

    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
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
          <div className={classes.progress}>
            <Typography variant="body1">Onboarding Completeness: 70%</Typography>
            <LinearProgress
              value={70}
              variant="determinate"
            />
          </div>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.uploadButton}
            color="primary"
            variant="text"
          >
            Upload picture
        </Button>
          <Button variant="text">Remove picture</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountProfile);
