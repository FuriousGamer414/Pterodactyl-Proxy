const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const TARGET = process.env.TARGET_URL || 'http://37.49.227.71';

app.set('trust proxy', true);

// --- URL Fix Middleware ---
app.use((req, res, next) => {
    if (req.headers.host && req.headers.host.includes(':80')) {
        // Redirect permanently to the clean URL without :80
        return res.redirect(301, `https://${req.headers.host.replace(':80', '')}${req.originalUrl}`);
    }
    next();
});

// --- Proxy ---
app.use(
    '/',
    createProxyMiddleware({
        target: TARGET,
        changeOrigin: true,
        xfwd: true,
        ws: true
    })
);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Proxy running on port ${PORT}`);
    console.log(`🔁 Forwarding traffic to: ${TARGET}`);
});
