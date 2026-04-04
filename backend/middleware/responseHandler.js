// 📝 Response Standardization Middleware
// All API responses follow this format:
// { success: true/false, message: "...", data: {...} }

const responseHandler = (req, res, next) => {
  // Override res.json to standardize responses
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    // If response already has success field, use it as-is
    if (body.hasOwnProperty('success')) {
      return originalJson(body);
    }

    // Otherwise, wrap it in standard format
    const response = {
      success: res.statusCode < 400,
      message: body.message || (res.statusCode < 400 ? "Request successful" : "Request failed"),
      data: body.data || body
    };

    return originalJson(response);
  };

  next();
};

module.exports = { responseHandler };
