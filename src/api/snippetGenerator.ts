import {
    SNIPPET_GENERATOR_URL,
    SNIPPET_GENERATOR_USER,
    SNIPPET_GENERATOR_PASS
} from "config";

const URL = SNIPPET_GENERATOR_URL;
const AuthHeader = `Basic ${btoa(`${SNIPPET_GENERATOR_USER}:${SNIPPET_GENERATOR_PASS}`)}`;

type SnippetType = "templates" | "snippets";

export async function fetchSnippets(
    emailAddress: string,
    type: SnippetType = "templates",
    asCsv: boolean = false
): Promise<any> {
    const response = await fetch(
        `${URL}/snippets/${emailAddress}/${type}/${asCsv}`, {
            method: 'GET',
            headers: {
                Authorization: AuthHeader
            }
        }
    );

    const json = await response.json();
    return json;
}