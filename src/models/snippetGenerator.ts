export type HandwrittenEmail = string;
export type Template = string;
export type Snippet = string;

export interface GenerateTemplatesResponse {
    handwritten_emails?: HandwrittenEmail[];
    templates?: Template[];
}

export type GenerateSnippetsResponse = Snippet[];