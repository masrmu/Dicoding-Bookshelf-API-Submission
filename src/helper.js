const createResponse = (h, code, message = null, data = null) => {
  const responseData = {
    status: [200, 201].includes(code) ? "success" : "fail",
  };

  if (message) responseData.message = message;
  if (data) responseData.data = data;

  const response = h.response(responseData);
  response.code(code);

  return response;
};

module.exports = {
  createResponse,
};
