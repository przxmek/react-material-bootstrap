const prod = {
  API_URL: "https://admin.pointapi.com/api",
  SNIPPET_GENERATOR_URL: "https://snippet-generator.pointapi.com",
  SNIPPET_GENERATOR_USER: "point",
  SNIPPET_GENERATOR_PASS: "scoobyDoo123$",
  GOOGLE_CLIENT_ID: "772957098874-tn6n2pk1l14le633l9i2iri2dagoiqeo.apps.googleusercontent.com",
  GOOGLE_SCOPE: "profile email https://www.googleapis.com/auth/spreadsheets.readonly",
};

const dev = {
  API_URL: "https://admin-dev.pointapi.com/api",
  SNIPPET_GENERATOR_URL: "https://dev-snippet-generator.pointapi.com",
  SNIPPET_GENERATOR_USER: "point",
  SNIPPET_GENERATOR_PASS: "scoobyDoo123$",
  GOOGLE_CLIENT_ID: "772957098874-m5s9ttjsb52ug0kbpjb7ikq70g2r026o.apps.googleusercontent.com",
  GOOGLE_SCOPE: "profile email https://www.googleapis.com/auth/spreadsheets.readonly",
};

const local = {
  API_URL: "http://localhost:5000/api",
  SNIPPET_GENERATOR_URL: "https://dev-snippet-generator.pointapi.com",
  SNIPPET_GENERATOR_USER: "point",
  SNIPPET_GENERATOR_PASS: "scoobyDoo123$",
  GOOGLE_CLIENT_ID: "772957098874-eagp8ra2sfj4cum27b77d4k3b9om3ck9.apps.googleusercontent.com",
  GOOGLE_SCOPE: "profile email https://www.googleapis.com/auth/spreadsheets.readonly",
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
export const GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID;
export const GOOGLE_SCOPE = config.GOOGLE_SCOPE;
