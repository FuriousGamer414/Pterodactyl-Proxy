const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Get target URL from environment variable
const TARGET_URL = process.env.TARGET_URL;

if (!TARGET_URL) {
  throw new Error("Missing TARGET_URL environment variable");
}

// Trust Render's proxy headers
app.set("trust proxy", true);

// Proxy middleware
app.use(
  "/",
  createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    xfwd: true,
    headers: {
      "X-Forwarded-Proto": "https"
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader("X-Forwarded-Proto", "https");
    },
    logLevel: "debug"
  })
);

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
  console.log(`🔁 Forwarding traffic to: ${TARGET_URL}`);
});
