import { API_URL } from "config";
import { User } from "auth";

export async function sendAuthResponse(
  idToken: string,
  accessToken: string,
) {
  const response = await fetch(
    `${API_URL}/auth`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ idToken, accessToken }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    return;
  } else {
    throw new Error(`Failed to auth (HTTP ${response.status} response)`);
  }
}
  
export async function sendOfflineAuthResponse(
  authCode: string,
): Promise<User> {
  const response = await fetch(
    `${API_URL}/auth/offline`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ authCode }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    return (await response.json()).user;
  } else {
    throw new Error(`Failed to offline auth (HTTP ${response.status} response)`);
  }
}