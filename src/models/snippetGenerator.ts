export interface TemplatesResponse {
  handwritten_emails?: Snippet[];
  templates?: Snippet[];

  result?: "failure";
  message?: string;
}

export interface SnippetsResponse {
  snippets?: Snippet[];
  
  result?: "failure";
  message?: string;
}

export interface Snippet {
  trigger: string;
  snippet: string;
  score?: number;
}

export interface ApplyResponse {
  result: ApplyResponseItem[];
}

export interface ApplyResponseItem extends Snippet {
  status: string;
}