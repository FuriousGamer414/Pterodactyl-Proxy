const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const TARGET = process.env.TARGET_URL || 'http://37.49.227.71';

app.set('trust proxy', true);

// Set X-Forwarded headers correctly
app.use((req, res, next) => {
  req.headers['x-forwarded-proto'] = 'https';
  req.headers['x-forwarded-host'] = req.headers.host?.replace(':80', '');
  next();
});

// Proxy
app.use(
  '/',
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    xfwd: true,
    ws: true,
  })
);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
  console.log(`🔁 Forwarding traffic to: ${TARGET}`);
});
