import { PrometheusTemplate } from "./templates";

export interface PrometheusTemplatesResponse {
    custom: PrometheusTemplate[];
    generated: PrometheusTemplate[];
}