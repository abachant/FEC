const express = require('express')
const app = express();
const port = 8080;
app.use(express.static('client/dist'));
app.use(express.json());

const { createProxyMiddleware } = require('http-proxy-middleware');
const API_SERVICE_URL = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/';
const dotenv = require('dotenv');
dotenv.config();

app.use('/atelier', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/atelier`]: '',
  },
  onProxyReq: function onProxyReq(proxyReq, req) {
    proxyReq.setHeader('Authorization', process.env.API_KEY);
    if (req.body) {
      var bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type','application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})