import { API_URL } from "config";
import { PrometheusTemplatesResponse, PrometheusSuggestionsResponse } from "models/prometheus";
import { PrometheusTemplate } from "models/templates";

export async function fetchSnippets(
  emailAddress: string
): Promise<PrometheusTemplatesResponse> {
  const response = await fetch(`${API_URL}/prometheus/${emailAddress}/snippets`);
  if (response.ok) {
    const json = await response.json();
    return processGetResponse(json);
  } else {
    throw new Error(`Failed to fetch snippets (HTTP ${response.status} response)`);
  }
}

export async function fetchSuggestions(
  emailAddress: string
): Promise<PrometheusSuggestionsResponse> {
  const response = await fetch(`${API_URL}/prometheus/${emailAddress}/suggestions`);
  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    throw new Error(`Failed to fetch suggestions (HTTP ${response.status} response)`);
  }
}

export async function createOrUpdateSnippet(
  emailAddress: string,
  snippet: PrometheusTemplate,
) {
  const response = await putSnippetInternal(emailAddress, snippet);

  if (response.ok) {
    const json = await response.json();
    return processPutResponse(json);
  } else {
    throw new Error(`Failed to create/update snippet (HTTP ${response.status} response)`);
  }
}

export async function deleteSnippet(
  emailAddress: string,
  id: string,
) {
  const response = await fetch(
    `${API_URL}/prometheus/${emailAddress}/snippet/${id}`,
    {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      }
    }
  );

  if (response.ok) {
    if (response.status === 204) {
      return;
    } else {
      const result = await response.json();
      return result;
    }
  } else {
    throw new Error(`Failed to update snippet (HTTP ${response.status} response)`);
  }
}

async function putSnippetInternal(
  emailAddress: string,
  snippet: PrometheusTemplate,
): Promise<Response> {
  let url = `${API_URL}/prometheus/${emailAddress}/snippet`;
  if (snippet.id_) {
    url = `${url}/${snippet.id_}`;
  }

  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(snippet),
    headers: {
      "Content-Type": "application/json",
    }
  });
}

function processPutResponse(response: any): PrometheusTemplate {
  return wrapIntoObject(response);
}

function processGetResponse(response: any): PrometheusTemplatesResponse {
  if (response.custom) {
    response.custom = response.custom.map(wrapIntoObject);
  }

  if (response.generated) {
    response.generated = response.generated.map(wrapIntoObject);
  }

  return response;
}

function wrapIntoObject(rawItem: any): PrometheusTemplate {
  return { type: "prometheusSnippet", ...rawItem };
}