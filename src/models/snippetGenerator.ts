export interface TemplatesResponse {
  handwritten_emails?: Snippet[];
  templates?: Snippet[];
}

export type SnippetsResponse = Snippet[];


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