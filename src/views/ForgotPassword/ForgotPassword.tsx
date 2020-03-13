import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  TextField,
  Link,
  Typography,
  Theme,
  Container,
  CssBaseline,
  Avatar,
  Box,
  LinearProgress
} from '@material-ui/core';
import { User } from 'auth';
import { connect } from 'react-redux';
import { setUser } from 'redux/actions';
import { RootStateType } from 'redux/reducers';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import {
  Link as RouterLink
} from "react-router-dom";
import { timeout } from 'common/async';
import { Copyright } from 'components';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
};

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  showLoginForm?: boolean;
  user?: User;
}

interface PathParamsType {
}

type PropsType = Props & RouteComponentProps<PathParamsType>;

interface FormStateType {
  isValid: boolean;
  values: { [key: string]: string | boolean };
  touched: { [key: string]: boolean };
  errors: { [key: string]: string };
}

const ForgotPassword: React.FunctionComponent<PropsType> = props => {
  const { history } = props;

  const classes = useStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormStateType>({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(newFormState => ({
      ...newFormState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    event.persist();

    setFormState(newFormState => ({
      ...newFormState,
      values: {
        ...newFormState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? (event.target as EventTarget & HTMLInputElement).checked
            : event.target.value
      },
      touched: {
        ...newFormState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await timeout(3000);
    history.push('/');
    setLoading(false);
  };

  const hasError = (field: string) => {
    return formState.touched[field] && formState.errors[field] ? true : false;
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RefreshIcon />
        </Avatar>

        <Typography component="h1" variant="h2" gutterBottom>
          Password Reset
        </Typography>

        <Typography variant="subtitle2" paragraph>
          {"Enter  the email address that you used to register. "}
          {"We'll send you an email with your username "}
          {"and a link to reset your password."}
        </Typography>
        <form
          className={classes.form}
          noValidate={true}
          onSubmit={handleSignIn}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            autoFocus
            error={hasError('email')}
            helperText={
              hasError('email') ? formState.errors.email[0] : null
            }
            onChange={handleChange}
            value={formState.values.email || ''}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!formState.isValid || loading}
          >
            Send
          </Button>

          <LinearProgress
            hidden={!loading}
          />

          <Grid container>
            <Grid item xs>
              <Link
                component={RouterLink}
                to="/sign-in"
                variant="body2"
              >
                Sign In
              </Link>
            </Grid>

            <Grid item>
              <Link
                component={RouterLink}
                to="/sign-up"
                variant="body2"
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};


const mapStateToProps = (state: RootStateType) => {
  return { user: state.user };
};

const dispatchProps = {
  setUser
};

export default connect(
  mapStateToProps,
  dispatchProps
)(withRouter(ForgotPassword));