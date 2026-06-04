require('dotenv').config({ path: '../.env.local' })
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(bodyParser.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const authRoutes = require('./routes/auth')
const subjectRoutes = require('./routes/subjects')
const topicRoutes = require('./routes/topics')
const aiRoutes = require('./routes/ai')

app.use('/api/auth', authRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/topics', topicRoutes)
app.use('/api/ai', aiRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
