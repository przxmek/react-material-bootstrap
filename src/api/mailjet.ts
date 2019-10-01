import { API_URL } from "config";
import Contact from "models/mailjet/contact";

/**
 * Get a list of all contacts
 */
export async function fetchMailjetContacts(): Promise<Contact[]> {
  const response = await fetch(`${API_URL}/mailjet/contacts`);

  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    throw new Error(`Failed to fetch Mailjet Contacts (HTTP ${response.status} response)`);
  }
}

/**
 * Get a specific contact
 * @param emailAddress Contact's email address
 */
export async function fetchMailjetContact(emailAddress: string): Promise<Contact> {
  const response = await fetch(`${API_URL}/mailjet/contact/${emailAddress}`);

  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    if (response.status === 404) {
      throw new Error(`Mailjet Contact doesn't exist (email: ${emailAddress})`);
    }

    throw new Error(`Failed to fetch Mailjet Contact (email: ${emailAddress})`);
  }
}


/**
 * Change Contact's stage.
 * @param emailAddress Contact's email address
 */
export async function changeContactStage(emailAddress: string, stage: string): Promise<void | any> {
  const response = await fetch(
    `${API_URL}/mailjet/contact/${emailAddress}/stage`, {
    method: 'PUT',
    body: JSON.stringify({ stage }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.status === 204) {
    return;
  } else {
    const json = await response.json();
    return json;
  }
}

