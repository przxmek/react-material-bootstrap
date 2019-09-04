import { API_URL } from "config";
import Contact from "models/mailjet/contact";

export async function fetchMailjetContact(emailAddress: string): Promise<Contact> {
  const response = await fetch(`${API_URL}/mailjet/contact/${emailAddress}`);

  const json = await response.json();
  return json;
}