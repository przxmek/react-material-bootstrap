import { GoogleLoginResponse } from "react-google-login";

export interface Auth {
  authorized: boolean;
  user?: User;
  googleAuth?: GoogleLoginResponse;
}

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
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
    id: googleProfile.getId(),
    name: googleProfile.getName(),
    email: googleProfile.getEmail(),
    imageUrl: googleProfile.getImageUrl(),
  };

  return user;
}