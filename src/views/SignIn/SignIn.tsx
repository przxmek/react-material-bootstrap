import React, { useState, useEffect, FormEvent } from 'react';
import { Link as RouterLink, withRouter, RouteComponentProps } from 'react-router-dom';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography,
  Theme
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { GOOGLE_CLIENT_ID, GOOGLE_SCOPE } from 'config';
import { showAlert } from 'components';
import { fromGoogleAuth, Auth, User } from 'auth';
import sendAuthResponse from 'api/auth';
import { connect } from 'react-redux';
import { setUser } from 'redux/actions';
import { RootStateType } from 'redux/reducers';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.common.white,
    fontWeight: 300,
    fontStyle: "italic",
    padding: theme.spacing(0, 4),
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.common.white
  },
  bio: {
    color: theme.palette.common.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));

interface Props {
  showLoginForm?: boolean;
  user?: User;
  setUser: (user?: User) => void;
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

const SignIn: React.FunctionComponent<PropsType> = props => {
  const { history, showLoginForm } = props;

  const classes = useStyles();

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

  const handleAuth = async (auth: Auth) => {
    if (auth.googleAuth) {
      try {
        await sendAuthResponse(
          auth.googleAuth.getAuthResponse().id_token,
          auth.googleAuth.getAuthResponse().access_token
        );

        handleBack();
      } catch (e) {
        showAlert("error", e.message, 10000);
      }
    }
    props.setUser(auth.user);
  };

  const googleAuthSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    handleAuth(fromGoogleAuth(response as GoogleLoginResponse));
  };

  const googleAuthFailure = (response: { error: string }) => {
    showAlert('error', `Failed to sign in with Google: ${response.error}`);
  };

  const handleBack = () => {
    if (history.length) {
      history.goBack();
    } else {
      history.push('/');
    }
  };

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

  const handleSignIn = (event: FormEvent) => {
    event.preventDefault();
    history.push('/');
  };

  const hasError = (field: string) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h2"
              >
                “This program makes responding to hundreds of customer support emails incredibly easy.
                It learns from your previous responses and adapts in real-time to provide
                full-sentence suggestions.”
              </Typography>
              <div>
                <Typography
                  className={classes.name}
                  variant="body1"
                >
                  Sean Mournighan
                </Typography>
                <Typography
                  className={classes.bio}
                  variant="body2"
                >
                  IT Technical Support at ReadTheory.org
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignIn}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Sign in
                </Typography>
                <Grid
                  className={classes.socialButtons}
                  container
                  spacing={2}
                >
                  <Grid item>
                    <GoogleLogin
                      clientId={GOOGLE_CLIENT_ID}
                      scope={GOOGLE_SCOPE}
                      onSuccess={googleAuthSuccess}
                      onFailure={googleAuthFailure}
                      cookiePolicy={'single_host_origin'}
                      accessType="offline"
                      isSignedIn={true}
                    />
                  </Grid>
                </Grid>
                {showLoginForm && (<>
                  <Typography
                    align="center"
                    className={classes.sugestion}
                    color="textSecondary"
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                  <TextField
                    className={classes.textField}
                    error={hasError('email')}
                    fullWidth
                    helperText={
                      hasError('email') ? formState.errors.email[0] : null
                    }
                    label="Email address"
                    name="email"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.email || ''}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError('password')}
                    fullWidth
                    helperText={
                      hasError('password') ? formState.errors.password[0] : null
                    }
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    value={formState.values.password || ''}
                    variant="outlined"
                  />
                  <Button
                    className={classes.signInButton}
                    color="primary"
                    disabled={!formState.isValid}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/sign-up"
                      variant="h6"
                    >
                      Sign up
                    </Link>
                  </Typography>
                </>)}
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
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
)(withRouter(SignIn));