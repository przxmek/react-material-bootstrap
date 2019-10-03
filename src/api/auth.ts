import { API_URL } from "config";

export default async function sendAuthResponse(
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