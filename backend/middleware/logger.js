// 📋 Request Logging Middleware

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.method !== "GET") {
    console.log("   Body:", JSON.stringify(req.body).substring(0, 200));
  }

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode < 400 ? "✅" : res.statusCode < 500 ? "⚠️" : "❌";
    console.log(`${statusColor} ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = { requestLogger };
