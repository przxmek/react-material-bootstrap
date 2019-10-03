export interface Template {
  score?: number;
  text: string;
  trigger: string;
  type: TemplateType;
  labels: string[];
}

export interface PrometheusTemplate extends Template {
  blacklisted?: boolean;
  chosen_frequency?: number;
  date_created?: number;
  id_?: Readonly<string>;
  last_updated?: number;
  type_?: "custom" | "generated";
  variables?: any[];
}

export type TemplateType =
  "template" |
  "templateWithVars" |
  "potentialTemplate" |
  "potentialTemplateWithVars" |
  "paragraphSnippet" |
  "prometheusSnippet";