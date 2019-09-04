import { API_URL } from "config";
import Contact from "models/mailjet/contact";

/**
 * Get a list of all contacts
 */
export async function fetchMailjetContacts(): Promise<Contact[]> {
  const response = await fetch(`${API_URL}/mailjet/contacts`);

  const json = await response.json();
  return json;
}

/**
 * Get a specific contact
 * @param emailAddress Contact's email address
 */
export async function fetchMailjetContact(emailAddress: string): Promise<Contact> {
  const response = await fetch(`${API_URL}/mailjet/contact/${emailAddress}`);

  const json = await response.json();
  return json;
}