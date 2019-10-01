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
    height: 60,
    width: 60,
    flexShrink: 0,
    flexGrow: 0
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

interface State { }

class AccountProfile extends React.Component<PropsType, State> {

  public render() {
    const { classes, className, account, ...rest } = this.props;

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
