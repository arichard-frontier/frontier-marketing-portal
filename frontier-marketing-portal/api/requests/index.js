const { ClientSecretCredential } = require("@azure/identity");

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

    context.res = {
      status: 200,
      body: {
        success: true,
        tokenReceived: !!token,
      },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
  }
};