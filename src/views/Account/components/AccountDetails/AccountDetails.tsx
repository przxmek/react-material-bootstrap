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
  TextField
} from '@material-ui/core';
import User from 'models/user';

const styles = createStyles({
  root: {}
});

interface Props {
  className?: string;
  account?: User;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class AccountDetails extends React.Component<PropsType, State> {

  public render() {
    const { classes, className, account, ...rest } = this.props;

    const states = [
      {
        value: 'alabama',
        label: 'Alabama'
      },
      {
        value: 'new-york',
        label: 'New York'
      },
      {
        value: 'san-francisco',
        label: 'San Francisco'
      }
    ];

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
        <form
          autoComplete="off"
          noValidate
        >
          <CardHeader
            subheader="The information can be edited"
            title="Profile"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  margin="dense"
                  name="firstName"
                  // onChange={handleChange}
                  required
                  value={"account.firstName"}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  margin="dense"
                  name="lastName"
                  // onChange={handleChange}
                  required
                  value={"account.lastName"}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  margin="dense"
                  name="email"
                  // onChange={handleChange}
                  required
                  value={account.email_address}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  margin="dense"
                  name="phone"
                  // onChange={handleChange}
                  type="number"
                  value={"account.phone"}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Select State"
                  margin="dense"
                  name="state"
                  // onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={"account.state"}
                  variant="outlined"
                >
                  {states.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Country"
                  margin="dense"
                  name="country"
                  // onChange={handleChange}
                  required
                  value={"account.country"}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="contained"
            >
              Save details
          </Button>
          </CardActions>
        </form>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountDetails);
