const {
  ClientSecretCredential,
} = require("@azure/identity");

require("isomorphic-fetch");

const {
  Client,
} = require(
  "@microsoft/microsoft-graph-client"
);

const UPLOAD_DRIVE_ID =
  "b!vzGBynwIjEio87AfpEpKCrlrS0VCQLFFtsE-qddUu1Q5DAU3No82RIWWrLQjVS0a";

  const SITE_ID =
  "frontierbankoftexas.sharepoint.com,ca8131bf-087c-488c-a8f3-b01fa44a4a0a,454b6bb9-4042-45b1-b6c1-3ea9d754bb54";

const REQUEST_LIST_ID =
  "93129ad2-c170-4f4e-b79c-d989748a8b13";

const CATEGORY_FOLDERS = {
  "social-media":
    "01GMXASG2SSOWEANPWIZG3HAYYE7RFXP3R",

  "business-cards":
    "01GMXASG5TICERJAT2NZDISXHQTCQHW5OL",

  "advertisement":
    "01GMXASG7DHPKVB2AGPVGYBKLMU6O3FSUU",

  "marketing-materials":
    "01GMXASG557L76DB234BAIP4FL2PZR5FAS",
};

async function getGraphClient() {
  const credential =
    new ClientSecretCredential(
      process.env.TENANT_ID,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    );

  const token =
    await credential.getToken(
      "https://graph.microsoft.com/.default"
    );
  return Client.init({
    authProvider: (done) => {
      done(null, token.token);
    },
  });
}

function cleanFileName(value) {
  return String(value || "photo")
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "-");
}

module.exports = async function (
  context,
  req
) {
  try {
    const graphClient =
      await getGraphClient();

let body = {};

try {
  if (
    typeof req.body === "string"
  ) {
    body =
      JSON.parse(req.body);
  } else if (req.body) {
    body =
      req.body;
  }
} catch (parseError) {
  console.error(
    "UPLOAD BODY PARSE FAILED:",
    parseError
  );

  context.res = {
    status: 400,
    body: {
      error:
        "Unable to read upload information.",
    },
  };

  return;
}

console.log(
  "UPLOAD REQUEST NUMBER:",
  body.requestNumber
);

console.log(
  "UPLOAD CATEGORY:",
  body.uploadCategory
);

console.log(
  "UPLOAD FILE NAME:",
  body.fileName
);

const requestNumber =
  body.requestNumber || "";

const requestId =
  body.requestId || "";

const originalFileName =
  body.fileName || "";

const contentType =
  body.fileType ||
  "application/octet-stream";

const uploadCategory =
  body.uploadCategory ||
  "social-media";

const proofVersion =
  body.proofVersion || "";

const categoryFolderId =
  CATEGORY_FOLDERS[
    uploadCategory
  ];

if (!categoryFolderId) {
  context.res = {
    status: 400,
    body: {
      error:
        "The upload category is invalid.",
    },
  };

  return;
}

if (!requestNumber) {
  context.res = {
    status: 400,
    body: {
      error:
        "Request number is required.",
    },
  };

  return;
}

if (!originalFileName) {
  context.res = {
    status: 400,
    body: {
      error:
        "File name is required.",
    },
  };

  return;
}

if (!body.fileData) {
  context.res = {
    status: 400,
    body: {
      error:
        "File data is required.",
    },
  };

  return;
}

const fileBuffer =
  Buffer.from(
    body.fileData,
    "base64"
  );

if (Buffer.isBuffer(req.body)) {
  fileBuffer = req.body;
} else if (
  req.rawBody &&
  Buffer.isBuffer(req.rawBody)
) {
  fileBuffer = req.rawBody;
} else if (
  typeof req.rawBody === "string"
) {
  fileBuffer = Buffer.from(
    req.rawBody,
    "binary"
  );
} else if (
  typeof req.body === "string"
) {
  fileBuffer = Buffer.from(
    req.body,
    "binary"
  );
} else {
  fileBuffer = Buffer.alloc(0);
}

console.log(
  "UPLOAD FILE:",
  originalFileName
);

console.log(
  "UPLOAD CONTENT TYPE:",
  contentType
);

console.log(
  "UPLOAD SIZE:",
  fileBuffer.length
);
    const maxFileSize =
      10 * 1024 * 1024;

    if (
      !fileBuffer.length ||
      fileBuffer.length >
        maxFileSize
    ) {
      context.res = {
        status: 400,
        body: {
          error:
            "Photo must be between 1 byte and 10 MB.",
        },
      };

      return;
    }

    const safeRequestNumber =
      cleanFileName(requestNumber);

    const safeFileName =
      cleanFileName(
        originalFileName
      );

    // Find or create the request folder.
let requestFolder;

try {
  requestFolder =
  await graphClient
    .api(
      `/drives/${UPLOAD_DRIVE_ID}/items/${categoryFolderId}:/${safeRequestNumber}`
    )
    .get();
} catch (folderLookupError) {
  if (
    folderLookupError.statusCode !== 404
  ) {
    throw folderLookupError;
  }

  requestFolder =
  await graphClient
    .api(
      `/drives/${UPLOAD_DRIVE_ID}/items/${categoryFolderId}/children`
    )
    .post({
        name:
          safeRequestNumber,

        folder: {},

        "@microsoft.graph.conflictBehavior":
          "fail",
      });
}

const finalFileName =
  isProofCategory
    ? `${safeRequestNumber}-Proof-${proofVersion}.pdf`
    : `${Date.now()}-${safeFileName}`;

const uploadedFile =
  await graphClient
    .api(
      `/drives/${UPLOAD_DRIVE_ID}/items/${requestFolder.id}:/${finalFileName}:/content`
    )
    .header(
      "Content-Type",
      contentType
    )
    .put(fileBuffer);

if (isProofCategory) {
  const uploadedAt =
    new Date().toISOString();

  await graphClient
    .api(
      `/sites/${SITE_ID}/lists/${REQUEST_LIST_ID}/items/${requestId}/fields`
    )
    .patch({
      Status:
        "Waiting Approval",

      ProofStatus:
        "Waiting Approval",

      ProofFileName:
        uploadedFile.name,

      ProofUrl:
        uploadedFile.webUrl,

      ProofVersion:
        Number(proofVersion),

      ProofUploadedAt:
        uploadedAt,

      ProofFeedback:
        "",

      ProofReviewedAt:
        null,
    });

  console.log(
    "PROOF SENT FOR APPROVAL:",
    requestId,
    uploadedFile.name
  );
}

    context.res = {
      status: 200,
      body: {
        success: true,

        id:
          uploadedFile.id,

        name:
          uploadedFile.name,

        webUrl:
          uploadedFile.webUrl,

        size:
          uploadedFile.size,

        requestNumber:
          safeRequestNumber,
      },
    };
  } catch (error) {
    console.error(
      "PHOTO UPLOAD FAILED:",
      error
    );

    context.res = {
      status: 500,
      body: {
        error:
          error.message ||
          "Photo upload failed.",

        code:
          error.code || null,

        statusCode:
          error.statusCode || null,
      },
    };
  }
};