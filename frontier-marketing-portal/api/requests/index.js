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

    const result = await graphClient
      .api("/sites/frontierbankoftexas.sharepoint.com")
      .get();

    context.res = {
      status: 200,
      body: result,
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        message: error.message,
        stack: error.stack,
      },
    };
  }
};