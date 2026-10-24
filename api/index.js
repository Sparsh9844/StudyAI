// Vercel serverless entry point — every /api/* request is rewritten
// here (see vercel.json) and handled by the existing Express app.
module.exports = require('../server/index.js')
