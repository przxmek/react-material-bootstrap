export interface PrometheusSnippetsResponse {
    custom: PrometheusSnippet[];
    generated: PrometheusSnippet[];
}

export interface PrometheusSnippet {
    blacklisted: boolean;
    chosen_frequency: number;
    date_created: number;
    id_: number;
    labels: string[];
    last_updated: number;
    score: number;
    text: string;
    trigger: string;
    type_: "custom" | "generated";
    variables: any[];
}