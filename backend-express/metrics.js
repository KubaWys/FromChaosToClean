const express = require('express');
const router = express.Router();
let requestCount = 0;

router.use((req, res, next) => {
  requestCount++;
  next();
});

router.get('/metrics', (req, res) => {
  res.type('text/plain').send(`express_request_count ${requestCount}`);
});

module.exports = router;
