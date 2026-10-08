const { ClientSecretCredential } = require("@azure/identity");
require("isomorphic-fetch");
const { Client } = require("@microsoft/microsoft-graph-client");

const SITE_ID =
  "frontierbankoftexas.sharepoint.com,ca8131bf-087c-488c-a8f3-b01fa44a4a0a,454b6bb9-4042-45b1-b6c1-3ea9d754bb54";

const LIST_ID =
  "93129ad2-c170-4f4e-b79c-d989748a8b13";

async function getGraphClient() {
  const credential = new ClientSecretCredential(
    process.env.TENANT_ID,
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  const token = await credential.getToken(
    "https://graph.microsoft.com/.default"
  );

  return Client.init({
    authProvider: (done) => {
      done(null, token.token);
    },
  });
}

module.exports = async function (context, req) {
  try {
    const graphClient = await getGraphClient();

    if (req.method === "GET") {
      const items = await graphClient
        .api(
          `/sites/${SITE_ID}/lists/${LIST_ID}/items?expand=fields`
        )
        .get();

      context.res = {
        status: 200,
        body: items,
      };

      return;
    }

    if (req.method === "POST") {
        context.log("POST HIT");
      const body = req.body || {};

      const item = await graphClient
        .api(
          `/sites/${SITE_ID}/lists/${LIST_ID}/items`
        )
        .post({
         fields: {
  Title:
    body.typeTitle ||
    "Marketing Request",

  RequestType:
    body.typeTitle ||
    "Other",

  Status: "Submitted",

  Branch:
    body.branchDepartment ||
    "",

  SubmittedEmail:
    body.requesterEmail ||
    "",

  Description:
    JSON.stringify(body.details || {})
},
        });

      context.res = {
        status: 200,
        body: item,
      };

      return;
    }

    context.res = {
      status: 405,
      body: {
        message: "Method not allowed",
      },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        error: error.message,
        details:
          error.body ||
          null,
      },
    };
  }
};