const prod = {
  API_URL: "http://localhost:5000",
  SNIPPET_GENERATOR_URL: "https://snippet-generator.pointapi.com/",
  SNIPPET_GENERATOR_USER: "point",
  SNIPPET_GENERATOR_PASS: "scoobyDoo123$",
};

const dev = {
  API_URL: "http://localhost:5000",
  SNIPPET_GENERATOR_URL: "https://dev-snippet-generator.pointapi.com/",
  SNIPPET_GENERATOR_USER: "point",
  SNIPPET_GENERATOR_PASS: "scoobyDoo123$",
};

const local = {
  API_URL: "http://localhost:5000",
  SNIPPET_GENERATOR_URL: "https://dev-snippet-generator.pointapi.com/",
  SNIPPET_GENERATOR_USER: "point",
  SNIPPET_GENERATOR_PASS: "scoobyDoo123$",
};

let config;
switch (process.env.REACT_APP_ENV) {
  case "prod":
    config = prod;
    break;
  case "dev":
    config = dev;
    break;
  default:
    config = local;
}

export const API_URL = config.API_URL;
export const SNIPPET_GENERATOR_URL = config.SNIPPET_GENERATOR_URL;
export const SNIPPET_GENERATOR_USER = config.SNIPPET_GENERATOR_USER;
export const SNIPPET_GENERATOR_PASS = config.SNIPPET_GENERATOR_PASS;
