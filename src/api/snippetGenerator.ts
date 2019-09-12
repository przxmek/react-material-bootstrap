import {
  SNIPPET_GENERATOR_URL,
  SNIPPET_GENERATOR_USER,
  SNIPPET_GENERATOR_PASS
} from "config";
import {
  ApplyResponse,
  Template,
  TemplatesResponse
} from "models/snippetGenerator";

const URL = SNIPPET_GENERATOR_URL;
const AuthHeader = `Basic ${btoa(`${SNIPPET_GENERATOR_USER}:${SNIPPET_GENERATOR_PASS}`)}`;

export type TemplateType =
  "templates" |
  "templates_with_vars" |
  "potential_templates" |
  "potential_templates_with_vars" |
  "paragraph_snippets";

export async function fetchTemplates(
  emailAddress: string,
  type?: TemplateType
): Promise<TemplatesResponse> {
  const response = await fetchTemplatesInternal(emailAddress, type);
  return processResponse(response);
}

export async function generateTemplates(
  emailAddress: string
): Promise<TemplatesResponse> {
  const response = await generateTemplatesInternal(emailAddress);
  return response;
}

export async function applySnippets(
  emailAddress: string,
  snippets: Template[],
  sendEmail?: boolean
): Promise<ApplyResponse> {
  return await applySnippetsInternal(emailAddress, snippets, sendEmail);
}

async function fetchTemplatesInternal(
  emailAddress: string,
  type?: TemplateType,
  csv?: boolean
): Promise<any> {
  // Build the URL
  let url = `${URL}/snippets/${emailAddress}`;
  if (type) {
    url = `${url}/${type}`;
    if (csv) {
      url = `${url}?csv`;
    }
  }

  const response = await fetch(url,
    {
      method: 'GET',
      headers: {
        Authorization: AuthHeader
      }
    }
  );

  if (!csv) {
    const json = await response.json();
    return json;
  } else {
    return response;
  }
}

async function generateTemplatesInternal(emailAddress: string): Promise<any> {
  const response = await fetch(
    `${URL}/snippets/${emailAddress}/generate`,
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
  snippets: Template[],
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

function processResponse(response: any) {
  if (response.paragraph_snippets) {
    response.paragraph_snippets = processSnippets(response.paragraph_snippets, 'snippet');
  }

  if (response.templates_with_vars) {
    response.templates_with_vars = processTemplatesWithVars(
      response.templates_with_vars,
      'template-with-var'
    );
  }

  if (response.templates) {
    response.templates = processTemplates(response.templates, 'template');
  }

  if (response.potential_templates_with_vars) {
    response.potential_templates_with_vars = processTemplatesWithVars(
      response.potential_templates_with_vars,
      'potential-template-with-var'
    );
  }

  if (response.potential_templates) {
    response.potential_templates = processTemplates(response.potential_templates, 'potential-template');
  }

  return response;
}

function processTemplates(data: any, name: string): Template[] {
  // Flatten templates array
  data = [].concat(...data);

  // Convert str[] into Template[]
  return data.map((s: string, idx: number) =>
    wrapIntoObject(s, `${name}-${idx + 1}`)
  );
}

function processTemplatesWithVars(data: string[], name: string): Template[] {
  // Convert string[] into Template[]
  return data.map((s: string, idx: number) =>
    wrapIntoObject(s, `${name}-${idx + 1}`)
  );
}

function processSnippets(data: any[][], name: string): Template[] {
  // Convert [snippet, count][] into Template[]
  return data.map((item: any[], idx: number) =>
    wrapIntoObject(item[0], `${name}-${idx + 1}`, item[1])
  );
}

function wrapIntoObject(snippet: string, trigger: string = '', score?: number): Template {
  return {
    trigger,
    snippet,
    score,
  };
}