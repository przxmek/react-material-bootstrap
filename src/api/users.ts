import User from "models/user";
import { API_URL } from "config";

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);


  if (response.ok) {
    const json = await response.json();

    return json.users;
  } else {
    throw new Error(`Failed to fetch users (HTTP ${response.status} response)`);
  }
}

export async function fetchUser(emailAddress: string): Promise<User> {
  const response = await fetch(
    `${API_URL}/user/${emailAddress}`, {
    method: 'GET',
  });


  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    throw new Error(`Failed to fetch user ${emailAddress} (HTTP ${response.status} response)`);
  }
}

export async function putUser(user: User): Promise<User> {
  const response = await fetch(
    `${API_URL}/user/${user.email_address}`, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    const json = await response.json();
    return json.user;
  } else {
    throw new Error(`Failed to update user ${user.email_address} (HTTP ${response.status} response)`);
  }
}

export async function addPremiumDays(user: User, premiumDays: number): Promise<User> {
  const response = await fetch(
    `${API_URL}/user/${user.email_address}/add_premium`, {
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
    throw new Error(`Failed to add ${premiumDays} premium days for user ${user.email_address} (HTTP ${response.status} response)`);
  }
}