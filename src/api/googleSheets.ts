import { API_URL } from "config";
import { WaitlistSpreadsheet } from "models/googleSheets";

export default async function getGoogleSheetsUserData(
  emailAddress: string,
): Promise<WaitlistSpreadsheet> {
  const response = await fetch(
    `${API_URL}/sheets/waitlist/${emailAddress}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Failed to get Google Sheets data (HTTP ${response.status} response)`);
  }
}