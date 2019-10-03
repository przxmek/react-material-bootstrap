import { GoogleLoginResponse } from "react-google-login";

export interface Auth {
  authorized: boolean;
  user?: User;
  googleAuth?: GoogleLoginResponse;
}

export interface User {
  email: string;
  familyName: string;
  givenName: string;
  googleId?: string;
  imageUrl?: string;
  name: string;
}

export function fromGoogleAuth(googleAuth: GoogleLoginResponse) {
  const auth: Auth = {
    authorized: true,
    user: userFromGoogleAuth(googleAuth),
    googleAuth
  };

  return auth;
}

export function unauthorized() {
  return {
    authorized: false,
  } as Auth;
}

function userFromGoogleAuth(googleAuth: GoogleLoginResponse) {
  const googleProfile = googleAuth.getBasicProfile();
  const user: User = {
    email: googleProfile.getEmail(),
    familyName: googleProfile.getFamilyName(),
    givenName: googleProfile.getGivenName(),
    googleId: googleProfile.getId(),
    imageUrl: googleProfile.getImageUrl(),
    name: googleProfile.getName(),
  };

  return user;
}