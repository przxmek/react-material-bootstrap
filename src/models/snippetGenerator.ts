export interface TemplatesResponse {
  handwritten_emails?: string[];
  templates?: string[];
}

export type SnippetsResponse = string[];


export interface Snippet {
  trigger?: string;
  snippet: string;
  score?: number;
}

export interface ApplyResponse {
  result: ApplyResponseItem[];
}

export interface ApplyResponseItem extends Snippet {
  status: string;
}