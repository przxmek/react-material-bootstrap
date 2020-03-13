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
import Contact from 'models/mailjet/contact';

const styles = createStyles({
  root: {}
});

interface Props {
  className?: string;
  account: User;
  contact?: Contact;
}

type PropsType = Props & WithStyles<typeof styles>;

interface State {
}

class AccountDetails extends React.Component<PropsType, State> {

  public render() {
    const { classes, className, account, contact, ...rest } = this.props;

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
