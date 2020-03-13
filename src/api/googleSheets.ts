import { API_URL } from "config";
import { WaitlistSpreadsheet, StarterPack } from "models/googleSheets";

export async function fetchWaitlistData(
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
    throw new Error(`Failed to get Google Sheets Waitlist data (HTTP ${response.status} response)`);
  }
}

export async function fetchStarterPacksData(): Promise<StarterPack[]> {
  const response = await fetch(
    `${API_URL}/sheets/starter-packs`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Failed to get Google Sheets StarterPacks data (HTTP ${response.status} response)`);
  }
}