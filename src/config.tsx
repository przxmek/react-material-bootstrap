const local = {
  API_URL: "http://localhost:5000"
};

let config;
switch (process.env.REACT_APP_ENV) {
  case "prod":
    config = local;
    break;
  case "dev":
    config = local;
    break;
  default:
    config = local;
}

export const API_URL = config.API_URL;
