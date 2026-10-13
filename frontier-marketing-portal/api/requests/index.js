const { ClientSecretCredential } = require("@azure/identity");
require("isomorphic-fetch");
const { Client } = require("@microsoft/microsoft-graph-client");

const SITE_ID =
  "frontierbankoftexas.sharepoint.com,ca8131bf-087c-488c-a8f3-b01fa44a4a0a,454b6bb9-4042-45b1-b6c1-3ea9d754bb54";

const LIST_ID =
  "93129ad2-c170-4f4e-b79c-d989748a8b13";
   const MARKETING_EMAIL =
  "marketing@frontierbankoftexas.bank";

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

    const method = (req.method || "").toUpperCase();

    if (method === "GET") {
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

    if (method === "POST") {
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

            SubmittedBy:
body.requesterName ||
"",
 
SubmittedEmail:
body.requesterEmail ||
"",
 
Description:
JSON.stringify(
body.details || {}
),
          },
        });

      context.res = {
        status: 200,
        body: item,
      };

      return;
    }

    if (method === "PATCH") {
  const body = req.body || {};

  console.log(
    "PATCH BODY:",
    JSON.stringify(body)
  );

  // Get the request before updating it
  // so we have the submitter's email.
  const existingItem = await graphClient
    .api(
      `/sites/${SITE_ID}/lists/${LIST_ID}/items/${body.id}?expand=fields`
    )
    .get();

  const requesterEmail =
    existingItem.fields?.SubmittedEmail || "";

  const requesterName =
    existingItem.fields?.SubmittedBy || "";

  // Update SharePoint first.
  await graphClient
    .api(
      `/sites/${SITE_ID}/lists/${LIST_ID}/items/${body.id}/fields`
    )
    .patch({
      Status: body.status,
      MarketingNotes:
        body.note || "",
    });

  console.log(
    "PATCH SUCCESS:",
    body.id,
    body.status
  );

  // Only attempt an email when the request
  // has a requester email.
  if (requesterEmail) {
    const requestNumber =
      `MKT-${new Date().getFullYear()}-${String(
        body.id
      ).padStart(4, "0")}`;

    const noteText =
      body.note
        ? `\n\nUpdate from Marketing:\n${body.note}`
        : "";

    const greeting =
      requesterName
        ? `Hi ${requesterName},`
        : "Hello,";

    const emailBody =
      `${greeting}

Your Frontier Marketing request has been updated.

Request: ${requestNumber}
Status: ${body.status}${noteText}

You can view the latest details under My Requests in the Frontier Marketing Portal.

Thank you,
Frontier Marketing`;

    await graphClient
      .api(
        `/users/${MARKETING_EMAIL}/sendMail`
      )
      .post({
        message: {
          subject:
            `Marketing Request ${requestNumber} Updated`,

          body: {
            contentType: "Text",
            content: emailBody,
          },

          toRecipients: [
            {
              emailAddress: {
                address:
                  requesterEmail,
              },
            },
          ],
        },

        saveToSentItems: true,
      });

    console.log(
      "STATUS EMAIL SENT:",
      requesterEmail
    );
  }

  context.res = {
    status: 200,
    body: {
      success: true,
    },
  };

  return;
}
    context.res = {
      status: 405,
      body: {
        message: "Method not allowed",
        receivedMethod: method,
      },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        error: error.message,
        statusCode:
          error.statusCode || null,
        code: error.code || null,
        body: error.body || null,
        stack: error.stack || null,
      },
    };
  }
};