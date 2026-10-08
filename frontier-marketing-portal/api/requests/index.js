const { ClientSecretCredential } = require("@azure/identity");
require("isomorphic-fetch");
const { Client } = require("@microsoft/microsoft-graph-client");

module.exports = async function (context, req) {
  try {
    const credential = new ClientSecretCredential(
      process.env.TENANT_ID,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    );

    const token = await credential.getToken(
      "https://graph.microsoft.com/.default"
    );

    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, token.token);
      },
    });

    const lists = await graphClient
      .api(
        "/sites/frontierbankoftexas.sharepoint.com,ca8131bf-087c-488c-a8f3-b01fa44a4a0a,454b6bb9-4042-45b1-b6c1-3ea9d754bb54/lists"
      )
      .get();

    context.res = {
      status: 200,
      body: lists,
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        error: error.message,
      },
    };
  }
};