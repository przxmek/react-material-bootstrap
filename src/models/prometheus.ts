import { PrometheusTemplate } from "./templates";

export interface PrometheusTemplatesResponse {
  custom: PrometheusTemplate[];
  generated: PrometheusTemplate[];
}

export interface PrometheusSuggestionsResponse {
  default: PrometheusSuggestion[];
  generated: PrometheusSuggestion[];
  custom: PrometheusSuggestion[];
}

export interface PrometheusSuggestion {
  text: string;
  _type: "default";
  score: number;
  sent_frequency: number;
  chosen_frequency: number;
  most_recent_send_date: number;
  least_recent_send_date: number;
  labels: string[];
  variables: string[];
  blacklisted: boolean;
}
