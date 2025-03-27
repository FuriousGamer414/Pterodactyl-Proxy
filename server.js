const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const TARGET = 'http://37.49.227.71';

app.set('trust proxy', true); // trust Render's reverse proxy

// Middleware to fix :80 being appended
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https' && req.headers.host.endsWith(':80')) {
    const cleanHost = req.headers.host.replace(':80', '');
    return res.redirect(301, `https://${cleanHost}${req.originalUrl}`);
  }
  next();
});

// Proxy all traffic
app.use(
  '/',
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    xfwd: true,
    ws: true,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('X-Forwarded-Proto', 'https');
    }
  })
);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
  console.log(`🔁 Forwarding traffic to: ${TARGET}`);
});
