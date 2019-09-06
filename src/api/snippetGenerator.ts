import {
  SNIPPET_GENERATOR_URL,
  SNIPPET_GENERATOR_USER,
  SNIPPET_GENERATOR_PASS
} from "config";
import {
  TemplatesResponse,
  SnippetsResponse,
  Snippet,
  ApplyResponse
} from "models/snippetGenerator";

const URL = SNIPPET_GENERATOR_URL;
const AuthHeader = `Basic ${btoa(`${SNIPPET_GENERATOR_USER}:${SNIPPET_GENERATOR_PASS}`)}`;

export type SnippetType = "templates" | "snippets";


export async function fetchTemplates(
  emailAddress: string
): Promise<TemplatesResponse> {
  const response = await fetchSnippetsInternal(emailAddress, "templates");
  return processTemplatesResponse(response);
}

export async function fetchSnippets(
  emailAddress: string
): Promise<SnippetsResponse> {
  const response = await fetchSnippetsInternal(emailAddress, "snippets");
  return processSnippetsResponse(response);
}

export async function generateTemplates(
  emailAddress: string
): Promise<TemplatesResponse> {
  const response = await generateSnippetsInternal(emailAddress, "templates");
  return processTemplatesResponse(response);
}

export async function generateSnippets(
  emailAddress: string
): Promise<SnippetsResponse> {
  const response = await generateSnippetsInternal(emailAddress, "snippets");
  return processSnippetsResponse(response);
}

export async function applySnippets(
  emailAddress: string,
  snippets: Snippet[],
  sendEmail?: boolean
): Promise<ApplyResponse> {
  return await applySnippetsInternal(emailAddress, snippets, sendEmail);
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

async function applySnippetsInternal(
  emailAddress: string,
  snippets: Snippet[],
  sendEmail: boolean = false
): Promise<any> {
  const response = await fetch(
    `${URL}/snippets/${emailAddress}/apply/${sendEmail}`,
    {
      method: 'POST',
      body: JSON.stringify(snippets),
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthHeader
      }
    }
  );

  const json = await response.json();
  return json;
}

function wrapIntoObject(snippet: string, trigger: string = '', score?: number): Snippet {
  return {
    trigger,
    snippet,
    score,
  };
}

function processTemplatesResponse(response: any) {
  // Flatten templates array madness
  response.templates = [].concat(...response.templates);

  // Convert strings into Snippet objects
  response.templates = response.templates.map(
    (s: string, idx: number) =>
      wrapIntoObject(s, `template-${idx + 1}`)
  );
  response.handwritten_emails = response.handwritten_emails.map(
    (s: string, idx: number) =>
      wrapIntoObject(s, `handwritten-email-${idx + 1}`)
  );

  return response;
}

function processSnippetsResponse(response: any) {
  // Convert snippet objects into Snippet objects
  response = response.map(
    (s: { snippet: string }, idx: number) =>
      wrapIntoObject(s.snippet, `snippet-${idx + 1}`)
  );

  return response;
}