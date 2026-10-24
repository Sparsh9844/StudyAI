const path = require('path')

// Load env vars FIRST — before any other require reads process.env
const dotenv = require('dotenv')
// (On Vercel these files don't exist — env vars come from the project settings.)
dotenv.config({ path: path.join(__dirname, '../.env.local'), quiet: true })
dotenv.config({ path: path.join(__dirname, '../.env'), quiet: true })

const express     = require('express')
const compression = require('compression')

const app  = express()
const PORT = process.env.PORT || 5001
const isProd = process.env.NODE_ENV === 'production'
// On Vercel the CDN serves the SPA; this app only handles /api/*
const isVercel = !!process.env.VERCEL

app.disable('x-powered-by')

// ── Gzip all responses ─────────────────────────────────────────
// Compresses every HTTP response on the fly.
// In production this is the single biggest latency win for slow
// connections — the HTML/JS/CSS payloads shrink by ~70%.
app.use(compression({ level: 6 }))

// ── No CORS middleware ──────────────────────────────────────────
// The SPA and API are always same-origin (Vite proxy in dev, one
// domain in production), so other sites are not allowed to call the API.

// ── Body parsing ────────────────────────────────────────────────
app.use(express.json({ limit: '100kb' }))

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/ai',       require('./routes/ai'))

// Unknown API routes → JSON 404 (never the SPA's index.html)
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

// ── Production (self-hosted, `npm start`): serve the Vite-built SPA ──
if (isProd && !isVercel) {
  const dist = path.join(__dirname, '../dist')

  // Static assets: hash-named files get a 1-year immutable cache.
  // index.html and non-hashed files get no-cache so the browser
  // always checks for a new version after a deploy.
  app.use(
    '/assets',
    express.static(path.join(dist, 'assets'), {
      maxAge: '1y',
      immutable: true,
    })
  )

  // Everything else in /dist (favicon, etc.) — short cache
  app.use(
    express.static(dist, {
      maxAge: '1h',
      setHeaders(res, filePath) {
        // HTML must never be cached so deploys take effect instantly
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        }
      },
    })
  )

  // SPA fallback — all non-API routes serve index.html
  // Express 5 (path-to-regexp v8) requires a named wildcard
  app.get('/{*splat}', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.sendFile(path.join(dist, 'index.html'))
  })
}

// ── Global error handler ────────────────────────────────────────
// Client errors (malformed JSON, body too large) keep their 4xx status.
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500
  if (status >= 500) console.error('[Server Error]', err.stack)
  res.status(status).json({ error: status >= 500 ? 'Internal Server Error' : err.message })
})

// Listen only when run directly (`npm run server` / `npm start`).
// On Vercel, api/index.js imports the app as a serverless function.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[StudyAI] Server running on port ${PORT} (${isProd ? 'production' : 'development'})`)
  })
}

module.exports = app
