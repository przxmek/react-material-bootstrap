import { API_URL } from "config";
import { PrometheusTemplatesResponse } from "models/prometheus";

export async function fetchSnippets(
  emailAddress: string
): Promise<PrometheusTemplatesResponse> {
  const response = await fetch(`${API_URL}/prometheus/${emailAddress}/snippets`);
  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    throw new Error(`Failed to fetch snippets (HTTP ${response.status} response)`);
  }
}