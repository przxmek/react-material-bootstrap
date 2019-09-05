export type HandwrittenEmail = string;
export type Template = string[];
export interface Snippet {
    snippet: string;
}

export interface GenerateTemplatesResponse {
    handwritten_emails: HandwrittenEmail[];
    templates: Template[];

}

export type GenerateSnippetsResponse = Snippet[];