module.exports = async function (context, req) {
  context.res = {
    status: 200,
    body: {
      success: true,
      tenantIdExists: !!process.env.TENANT_ID,
      clientIdExists: !!process.env.CLIENT_ID,
      secretExists: !!process.env.CLIENT_SECRET,
      listIdExists: !!process.env.SHAREPOINT_LIST_ID,
    },
  };
};