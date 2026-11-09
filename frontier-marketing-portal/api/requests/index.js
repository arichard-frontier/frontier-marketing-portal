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
  const allItems = [];

  let response =
    await graphClient
      .api(
        `/sites/${SITE_ID}/lists/${LIST_ID}/items`
      )
      .expand("fields")
      .top(200)
      .get();

  allItems.push(
    ...(response.value || [])
  );

  while (
    response["@odata.nextLink"]
  ) {
    const nextPath =
      response["@odata.nextLink"]
        .replace(
          "https://graph.microsoft.com/v1.0",
          ""
        );

    response =
      await graphClient
        .api(nextPath)
        .get();

    allItems.push(
      ...(response.value || [])
    );
  }

  context.res = {
    status: 200,
    body: {
      value: allItems,
    },
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
 

DateNeeded:
  body.dueDate ||
  null,

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

  if (
  body.action === "proof-review"
) {
  if (!body.id) {
    context.res = {
      status: 400,
      body: {
        error:
          "Request ID is required.",
      },
    };

    return;
  }

  if (
    body.proofDecision !==
      "Approved" &&
    body.proofDecision !==
      "Needs Edits"
  ) {
    context.res = {
      status: 400,
      body: {
        error:
          "A valid proof decision is required.",
      },
    };

    return;
  }

  if (
    body.proofDecision ===
      "Needs Edits" &&
    !String(
      body.proofFeedback || ""
    ).trim()
  ) {
    context.res = {
      status: 400,
      body: {
        error:
          "Comments are required when requesting edits.",
      },
    };

    return;
  }

  const reviewedAt =
    new Date().toISOString();

  await graphClient
    .api(
      `/sites/${SITE_ID}/lists/${LIST_ID}/items/${body.id}/fields`
    )
    .patch({
      ProofStatus:
        body.proofDecision,

      ProofFeedback:
        body.proofFeedback || "",

      ProofReviewedAt:
        reviewedAt,

      Status:
  body.proofDecision ===
  "Needs Edits"
    ? "In Progress"
    : "Approved",
    });

  context.res = {
    status: 200,
    body: {
      success: true,
      proofStatus:
        body.proofDecision,
    },
  };

  return;
}

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
  existingItem.fields?.SubmittedEmail ||
  "";

const requesterName =
  existingItem.fields?.SubmittedBy ||
  "";

const requestType =
  existingItem.fields?.RequestType ||
  "Marketing Request";

const branchDepartment =
  existingItem.fields?.Branch ||
  "";

const dueDate =
  existingItem.fields?.DateNeeded ||
  "";

let requestDetails = {};

try {
  requestDetails =
    existingItem.fields?.Description
      ? JSON.parse(
          existingItem.fields.Description
        )
      : {};
} catch {
  requestDetails = {};
}

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

// Only attempt an email when
// the request has an email address.
if (requesterEmail) {
  const requestNumber =
    `MKT-${new Date().getFullYear()}-${String(
      body.id
    ).padStart(4, "0")}`;

  const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) =>
      str.toUpperCase()
    );

const formatEmailDate = (value) => {
  if (!value) {
    return "";
  }

  const dateOnly =
    /^\d{4}-\d{2}-\d{2}$/.test(value);

  const date = dateOnly
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = date.getDate();

  const suffix =
    day % 10 === 1 &&
    day % 100 !== 11
      ? "st"
      : day % 10 === 2 &&
        day % 100 !== 12
      ? "nd"
      : day % 10 === 3 &&
        day % 100 !== 13
      ? "rd"
      : "th";

  const weekday =
    date.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

  const month =
    date.toLocaleDateString(
      "en-US",
      {
        month: "long",
      }
    );

  const year =
    date.getFullYear();

  return `${weekday}, ${month} ${day}${suffix}, ${year}`;
};

const detailRows =
  Object.entries(requestDetails)
    .filter(
      ([key, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined &&
        ![
          "fullName",
          "email",
          "branch",
          "dueDate",
        ].includes(key)
    )
    .map(
      ([key, value]) => `
        <tr>
          <td
            style="
              padding: 6px 16px 6px 0;
              font-weight: 700;
              vertical-align: top;
            "
          >
            ${escapeHtml(
              formatLabel(key)
            )}:
          </td>

          <td
            style="
              padding: 6px 0;
              vertical-align: top;
            "
          >
            ${escapeHtml(
              Array.isArray(value)
                ? value.join(", ")
                : value
            )}
          </td>
        </tr>
      `
    )
    .join("");

const greeting =
  requesterName
    ? `Hi ${escapeHtml(requesterName)},`
    : "Hello,";

const emailBody = `
<div
  style="
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    color: #222222;
    line-height: 1.55;
    max-width: 700px;
  "
>
  <p>${greeting}</p>

  <p>
    Your Frontier Marketing request
    has been updated.
  </p>

  <div
    style="
      background: #f5f3ee;
      border-left: 4px solid #a51e2d;
      padding: 14px 18px;
      margin: 18px 0 24px 0;
    "
  >
    <div>
      <strong>
        Request:
        ${escapeHtml(requestNumber)}
      </strong>
    </div>

    <div>
      <strong>
        Status:
        ${escapeHtml(body.status)}
      </strong>
    </div>

    ${
      body.note
        ? `
          <div style="margin-top: 6px;">
            <strong>
              Update from Marketing:
              ${escapeHtml(body.note)}
            </strong>
          </div>
        `
        : ""
    }
  </div>

  <h3
    style="
      color: #1f3636;
      margin-bottom: 8px;
    "
  >
    Request Details
  </h3>

  <table
    role="presentation"
    cellpadding="0"
    cellspacing="0"
    style="
      border-collapse: collapse;
      margin-bottom: 20px;
    "
  >
    <tr>
      <td
        style="
          padding: 6px 16px 6px 0;
          font-weight: 700;
          vertical-align: top;
        "
      >
        Request Type:
      </td>

      <td style="padding: 6px 0;">
        ${escapeHtml(requestType)}
      </td>
    </tr>

    <tr>
      <td
        style="
          padding: 6px 16px 6px 0;
          font-weight: 700;
          vertical-align: top;
        "
      >
        Requester:
      </td>

      <td style="padding: 6px 0;">
        ${escapeHtml(requesterName)}
      </td>
    </tr>

    <tr>
      <td
        style="
          padding: 6px 16px 6px 0;
          font-weight: 700;
          vertical-align: top;
        "
      >
        Email:
      </td>

      <td style="padding: 6px 0;">
        ${escapeHtml(requesterEmail)}
      </td>
    </tr>

    ${
      branchDepartment
        ? `
          <tr>
            <td
              style="
                padding: 6px 16px 6px 0;
                font-weight: 700;
                vertical-align: top;
              "
            >
              Branch:
            </td>

            <td style="padding: 6px 0;">
              ${escapeHtml(
                branchDepartment
              )}
            </td>
          </tr>
        `
        : ""
    }

    ${
      dueDate
        ? `
          <tr>
            <td
              style="
                padding: 6px 16px 6px 0;
                font-weight: 700;
                vertical-align: top;
              "
            >
              Due Date:
            </td>

            <td style="padding: 6px 0;">
              ${escapeHtml(
                formatEmailDate(
                  dueDate
                )
              )}
            </td>
          </tr>
        `
        : ""
    }
  </table>

  ${
    detailRows
      ? `
        <h3
          style="
            color: #1f3636;
            margin-bottom: 8px;
          "
        >
          Form Details
        </h3>

        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          style="
            border-collapse: collapse;
            margin-bottom: 20px;
          "
        >
          ${detailRows}
        </table>
      `
      : ""
  }

  <p>
    You can view the latest details
    under <strong>My Requests</strong>
    in the Frontier Marketing Portal.
  </p>

  <p>
    Thank you,<br />
    Frontier Marketing
  </p>
</div>
`;

  try {
    console.log(
      "ATTEMPTING STATUS EMAIL"
    );

    console.log(
      "FROM:",
      MARKETING_EMAIL
    );

    console.log(
      "TO:",
      requesterEmail
    );

    await graphClient
      .api(
        `/users/${MARKETING_EMAIL}/sendMail`
      )
      .post({
        message: {
          subject:
            `Marketing Request ${requestNumber} Updated`,

          body: {
  contentType: "HTML",
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
  } catch (emailError) {
    console.error(
      "STATUS EMAIL FAILED:",
      emailError
    );

    console.error(
      "EMAIL ERROR MESSAGE:",
      emailError.message
    );

    console.error(
      "EMAIL ERROR CODE:",
      emailError.code
    );

    console.error(
      "EMAIL ERROR STATUS:",
      emailError.statusCode
    );
  }
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