const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const TARGET = process.env.TARGET_URL
const PORT = process.env.PORT || 10000;

app.set('trust proxy', true);

// Middleware to remove ":80" from host if present
app.use((req, res, next) => {
  if (req.headers.host && req.headers.host.includes(':80')) {
    const cleanHost = req.headers.host.replace(':80', '');
    const newUrl = `https://${cleanHost}${req.originalUrl}`;
    return res.redirect(301, newUrl);
  }

  // Ensure correct protocol and host headers
  req.headers['x-forwarded-proto'] = 'https';
  req.headers['x-forwarded-host'] = req.headers.host?.replace(':80', '');
  next();
});

// Proxy middleware
app.use(
  '/',
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    xfwd: true,
    ws: true,
    onProxyReq: (proxyReq, req) => {
      const host = proxyReq.getHeader('host');
      if (host && host.includes(':80')) {
        proxyReq.setHeader('host', host.replace(':80', ''));
      }
    },
  })
);

app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
  console.log(`🔁 Forwarding traffic to: ${TARGET}`);
});
