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

    const requestNumber =
      req.headers["x-request-number"];

    const encodedFileName =
  req.headers["x-file-name"];

const originalFileName =
  encodedFileName
    ? decodeURIComponent(
        encodedFileName
      )
    : "";

    const contentType =
      req.headers["content-type"] ||
      "application/octet-stream";

      const uploadCategory =
  req.headers["x-upload-category"] ||
  "social-media";

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

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];

    if (
      !allowedTypes.includes(contentType)
    ) {
      context.res = {
        status: 400,
        body: {
          error:
            "Only JPG, JPEG, PNG, WEBP, HEIC, and HEIF images are allowed.",
        },
      };

      return;
    }

   let fileBuffer;

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

const uploadedFile =
  await graphClient
    .api(
      `/drives/${UPLOAD_DRIVE_ID}/items/${requestFolder.id}:/${Date.now()}-${safeFileName}:/content`
    )
    .header(
      "Content-Type",
      contentType
    )
    .put(fileBuffer);

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