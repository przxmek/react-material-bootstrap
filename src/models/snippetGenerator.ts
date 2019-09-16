export interface TemplatesResponse {
  paragraph_snippets: Template[] | undefined;
  potential_templates: Template[] | undefined; 
  potential_templates_with_vars: Template[] | undefined;
  templates: Template[] | undefined;
  templates_with_vars: Template[] | undefined;

  result?: "failure";
  message?: string;
}

export interface Template {
  trigger: string;
  snippet: string;
  score?: number;
}

export interface ApplyResponse {
  result: ApplyResponseItem[];

  status?: "failure";
  message?: string;
  traceback?: string[];
}

export interface ApplyResponseItem extends Template {
  status: string;
}