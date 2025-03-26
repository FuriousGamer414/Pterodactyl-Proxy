const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const target = process.env.TARGET_URL;

if (!target) {
  console.error("❌ TARGET_URL environment variable is not set.");
  process.exit(1);
}

app.use(
  "/",
  createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    secure: false,
    headers: {
      host: new URL(target).hostname,
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader("X-Forwarded-For", req.ip);
      proxyReq.setHeader("X-Forwarded-Proto", "https");
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy Error");
    }
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy is running on port ${PORT}`);
  console.log(`🔁 Forwarding traffic to: ${target}`);
});
