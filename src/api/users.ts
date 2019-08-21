import User from "models/user";

const BASE_URL = 'http://localhost:5000';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`);

  const json = await response.json();
  const users = json.users;

  return users;
}

export async function putUser(user: User): Promise<User> {
  const response = await fetch(
    `${BASE_URL}/user/${user.email_address}`, {
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