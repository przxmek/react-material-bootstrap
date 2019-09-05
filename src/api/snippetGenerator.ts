import {
  SNIPPET_GENERATOR_URL,
  SNIPPET_GENERATOR_USER,
  SNIPPET_GENERATOR_PASS
} from "config";
import {
  GenerateTemplatesResponse as TemplatesResponse,
  GenerateSnippetsResponse as SnippetsResponse
} from "models/snippetGenerator";

const URL = SNIPPET_GENERATOR_URL;
const AuthHeader = `Basic ${btoa(`${SNIPPET_GENERATOR_USER}:${SNIPPET_GENERATOR_PASS}`)}`;

export type SnippetType = "templates" | "snippets";


export async function fetchTemplates(emailAddress: string): Promise<TemplatesResponse> {
  return await fetchSnippetsInternal(emailAddress, "templates");
}

export async function fetchSnippets(emailAddress: string): Promise<SnippetsResponse> {
  return await fetchSnippetsInternal(emailAddress, "snippets");
}

export async function generateTemplates(emailAddress: string): Promise<TemplatesResponse> {
  return await generateSnippetsInternal(emailAddress, "templates");
}

export async function generateSnippets(emailAddress: string): Promise<SnippetsResponse> {
  return await generateSnippetsInternal(emailAddress, "snippets");
}

async function fetchSnippetsInternal(
  emailAddress: string,
  type: SnippetType,
  asCsv: boolean = false
): Promise<any> {
  const response = await fetch(
    `${URL}/snippets/${emailAddress}/${type}/${asCsv}`,
    {
      method: 'GET',
      headers: {
        Authorization: AuthHeader
      }
    }
  );

  const json = await response.json();
  return json;
}

async function generateSnippetsInternal(
  emailAddress: string,
  type: SnippetType,
): Promise<any> {
  const response = await fetch(
    `${URL}/snippets/${emailAddress}/${type}/generate`,
    {
      method: 'POST',
      headers: {
        Authorization: AuthHeader
      }
    }
  );

  const json = await response.json();
  return json;
}