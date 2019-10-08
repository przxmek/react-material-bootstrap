import React from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { GOOGLE_CLIENT_ID, GOOGLE_SCOPE } from 'config';
import { fromGoogleAuth, User } from 'auth';
import { showAlert } from 'components';
import { sendAuthResponse, sendOfflineAuthResponse } from 'api/auth';
import { RootStateType } from 'redux/reducers';
import { connect } from 'react-redux';
import { setUser } from 'redux/actions';


interface Props {
  user?: User;
  setUser: (user?: User) => void;
}

const PointLogin: React.FunctionComponent<Props> = (props) => {

  const handleAuth = async (login: GoogleLoginResponse) => {
    const auth = fromGoogleAuth(login);

    if (auth.googleAuth) {
      try {
        await sendAuthResponse(
          auth.googleAuth.getAuthResponse().id_token,
          auth.googleAuth.getAuthResponse().access_token
        );
      } catch (e) {
        showAlert("error", e.message, 10000);
      }
    }
    props.setUser(auth.user);
  };

  const handleOfflineAuth = async (login: GoogleLoginResponseOffline) => {
    try {
      const user = await sendOfflineAuthResponse(login.code);
      props.setUser(user);
    } catch (e) {
      showAlert("error", e.message, 10000);
    }
  };

  const googleAuthSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('code' in response) {
      await handleOfflineAuth(response);
    } else {
      await handleAuth(response);
    }
  };

  const googleAuthFailure = (response: { error: string }) => {
    showAlert('error', `Failed to sign in with Google: ${response.error}`);
  };

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      scope={GOOGLE_SCOPE}
      onSuccess={googleAuthSuccess}
      onFailure={googleAuthFailure}
      cookiePolicy={'single_host_origin'}
      responseType="code"
      accessType="offline"
      isSignedIn={true}
    />
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
)(PointLogin);