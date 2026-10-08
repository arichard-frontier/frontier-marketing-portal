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

    const site = await graphClient
      .api("/sites/frontierbankoftexas.sharepoint.com")
      .get();

    context.res = {
      status: 200,
      body: site,
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