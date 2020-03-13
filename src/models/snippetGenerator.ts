import { Template } from "./templates";

export interface TemplatesResponse {
  paragraph_snippets?: Template[];
  potential_templates?: Template[];
  potential_templates_with_vars?: Template[];
  templates?: Template[];
  templates_with_vars?: Template[];

  status?: "failure";
  message?: string;
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