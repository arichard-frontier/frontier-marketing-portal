import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "c53c4653-1d56-44c1-99be-8bd25426cfac",

    authority:
      "https://login.microsoftonline.com/7dbbeaba-e82c-40b2-8767-d73a84bd6a60",

    redirectUri: "/",
  },

  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};