import {
  SNIPPET_GENERATOR_URL,
  SNIPPET_GENERATOR_USER,
  SNIPPET_GENERATOR_PASS
} from "config";
import {
  ApplyResponse,
  TemplatesResponse
} from "models/snippetGenerator";
import { Template, TemplateType } from "models/templates";

const URL = SNIPPET_GENERATOR_URL;
const AuthHeader = `Basic ${btoa(`${SNIPPET_GENERATOR_USER}:${SNIPPET_GENERATOR_PASS}`)}`;

export type SnippetGeneratorTemplateType =
  "templates" |
  "templates_with_vars" |
  "potential_templates" |
  "potential_templates_with_vars" |
  "paragraph_snippets";

export interface SnippetGeneratorTemplate {
  score?: number;
  text: string;
  trigger: string;
}

export async function fetchTemplates(
  emailAddress: string,
  type?: TemplateType
): Promise<TemplatesResponse> {
  const internalType = type ? toSGType(type) : undefined;
  const response = await fetchTemplatesInternal(emailAddress, internalType);
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
  snippets: SnippetGeneratorTemplate[],
  sendEmail?: boolean
): Promise<ApplyResponse> {
  return await applySnippetsInternal(emailAddress, snippets, sendEmail);
}

async function fetchTemplatesInternal(
  emailAddress: string,
  type?: SnippetGeneratorTemplateType,
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
  snippets: SnippetGeneratorTemplate[],
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
    response.paragraph_snippets = processSnippets(
      response.paragraph_snippets,
      "paragraph_snippets"
    );
  }

  if (response.templates_with_vars) {
    response.templates_with_vars = processTemplatesWithVars(
      response.templates_with_vars,
      "templates_with_vars"
    );
  }

  if (response.templates) {
    response.templates = processTemplates(
      response.templates,
      "templates"
    );
  }

  if (response.potential_templates_with_vars) {
    response.potential_templates_with_vars = processTemplatesWithVars(
      response.potential_templates_with_vars,
      "potential_templates_with_vars"
    );
  }

  if (response.potential_templates) {
    response.potential_templates = processTemplates(
      response.potential_templates,
      "potential_templates"
    );
  }

  return response;
}

function processTemplates(
  data: any,
  type: SnippetGeneratorTemplateType
): Template[] {
  // Flatten templates array
  data = [].concat(...data);

  // Convert str[] into Template[]
  return data.map((s: string, idx: number) =>
    wrapIntoObject(s, type, `${typeToName(type)}-${idx + 1}`)
  );
}

function processTemplatesWithVars(
  data: string[],
  type: SnippetGeneratorTemplateType
): Template[] {
  // Convert string[] into Template[]
  return data.map((s: string, idx: number) =>
    wrapIntoObject(s, type, `${typeToName(type)}-${idx + 1}`)
  );
}

function processSnippets(
  data: any[][],
  type: SnippetGeneratorTemplateType,
): Template[] {
  // Convert [snippet, count][] into Template[]
  return data.map((item: any[], idx: number) =>
    wrapIntoObject(item[0], type, `${typeToName(type)}-${idx + 1}`, item[1])
  );
}

function wrapIntoObject(
  text: string,
  type: SnippetGeneratorTemplateType,
  trigger: string = '',
  score?: number
): Template {
  return {
    score,
    text: newLineToBrElement(escapeTags(text)),
    trigger,
    type: convertType(type),
    labels: [],
  };
}

function newLineToBrElement(text: string): string {
  return text.replace(/\n/g, '<br>\n');
}

function escapeTags(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function convertType(sgType: SnippetGeneratorTemplateType): TemplateType {
  switch (sgType) {
    case 'templates':
      return "template";
    case "templates_with_vars":
      return "templateWithVars";
    case "potential_templates":
      return "potentialTemplate";
    case "potential_templates_with_vars":
      return "potentialTemplateWithVars";
    case "paragraph_snippets":
      return "paragraphSnippet";
    default:
      throw new Error("Invalid template type");
  }
}

function typeToName(sgType: SnippetGeneratorTemplateType): string {
  switch (sgType) {
    case 'templates':
      return "template";
    case "templates_with_vars":
      return "template-with-var";
    case "potential_templates":
      return "potential-template";
    case "potential_templates_with_vars":
      return "potential-template-with-var";
    case "paragraph_snippets":
      return "paragraph-snippet";
    default:
      throw new Error("Invalid template type");
  }
}

function toSGType(type: TemplateType): SnippetGeneratorTemplateType {
  switch (type) {
    case 'template':
      return "templates";
    case "templateWithVars":
      return "templates_with_vars";
    case "potentialTemplate":
      return "potential_templates";
    case "potentialTemplateWithVars":
      return "potential_templates_with_vars";
    case "paragraphSnippet":
      return "paragraph_snippets";
    default:
      throw new Error("Invalid template type");
  }
}