import User from "models/user";
import { API_URL } from "config";

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);

  const json = await response.json();
  const users = json.users;

  return users;
}

export async function fetchUser(emailAddress: string): Promise<User> {
  const response = await fetch(
    `${API_URL}/user/${emailAddress}`, {
      method: 'GET',
    }
  );

  const json = await response.json();
  return json;
}

export async function putUser(user: User): Promise<User> {
  const response = await fetch(
    `${API_URL}/user/${user.email_address}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const json = await response.json();
  return json.user;
}

export async function addPremiumDays(emailAddress: string, premiumDays: number): Promise<User> {
  const response = await fetch(
    `${API_URL}/user/${emailAddress}/add_premium`, {
      method: 'POST',
      body: JSON.stringify({ premiumDays }),
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  if (response.ok) {
    const json = await response.json();
    return json.user;
  } else {
    throw new Error(`Failed to add ${premiumDays} premium days
       for user ${emailAddress} (HTTP ${response.status} response)`);
  }
}