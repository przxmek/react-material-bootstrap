import { API_URL } from "config";
import { PrometheusSnippetsResponse } from "models/prometheus";

export async function fetchSnippets(
    emailAddress: string
): Promise<PrometheusSnippetsResponse> {
    const response = await fetch(`${API_URL}/prometheus/${emailAddress}/snippets`);
    const json = await response.json();
    return json;
}