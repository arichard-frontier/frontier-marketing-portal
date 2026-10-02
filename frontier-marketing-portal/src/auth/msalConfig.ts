import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "cfe90983-953d-45e2-a642-0b8e80b2bcde",

    authority:
      "https://login.microsoftonline.com/7dbbeaba-e82c-40b2-8767-d73a84bd6a60",

    redirectUri: "http://localhost:5173"
  },

  cache: {
    cacheLocation: "sessionStorage"
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};