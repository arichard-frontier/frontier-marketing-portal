module.exports = async function (context, req) {
  if (req.method === "GET") {
    context.res = {
      status: 200,
      body: {
        message: "GET requests endpoint working"
      }
    };
    return;
  }

  if (req.method === "POST") {
    context.res = {
      status: 200,
      body: {
        message: "POST requests endpoint working",
        data: req.body
      }
    };
    return;
  }

  context.res = {
    status: 405,
    body: {
      message: "Method not allowed"
    }
  };
};
