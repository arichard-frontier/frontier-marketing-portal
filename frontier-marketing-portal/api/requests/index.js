const { ClientSecretCredential } = require("@azure/identity");

module.exports = async function (context, req) {
  context.res = {
    status: 200,
    body: {
      libraryLoaded: true,
      credentialType: typeof ClientSecretCredential
    }
  };
};