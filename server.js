import express from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/coss-website'
let db = null
let quizStatsCollection = null
let analyticsCollection = null
let sessionsCollection = null

const client = new MongoClient(MONGO_URI)

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect()
    db = client.db()
    quizStatsCollection = db.collection('quiz_stats')
    analyticsCollection = db.collection('analytics_events')
    sessionsCollection = db.collection('sessions')
    
    // Create indexes
    await quizStatsCollection.createIndex({ questionId: 1 })
    await analyticsCollection.createIndex({ sessionId: 1, timestamp: 1 })
    await analyticsCollection.createIndex({ eventType: 1 })
    await sessionsCollection.createIndex({ sessionId: 1 }, { unique: true })
    
    console.log('✓ Connected to MongoDB')
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

// Simple CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  
  next()
})

// ============== HEALTH CHECK ==============

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// ============== QUIZ ENDPOINTS ==============

app.post('/submit', async (req, res) => {
  try {
    const { questionId, gotItRight } = req.body
    if (typeof questionId === 'undefined' || typeof gotItRight === 'undefined') {
      return res.status(400).json({ error: 'questionId and gotItRight are required' })
    }

    const id = String(questionId)
    
    // Find or create stats for this question
    let stats = await quizStatsCollection.findOne({ questionId: id })
    if (!stats) {
      stats = { questionId: id, correct: 0, total: 0 }
    }

    stats.total = (stats.total || 0) + 1
    if (gotItRight) stats.correct = (stats.correct || 0) + 1

    // Update in database
    await quizStatsCollection.updateOne(
      { questionId: id },
      { $set: stats },
      { upsert: true }
    )

    const total = stats.total || 0
    const correct = stats.correct || 0
    const percentage = total ? (correct / total) * 100 : 0

    return res.json({ total, correct, percentage })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/stats/:questionId', async (req, res) => {
  try {
    const id = String(req.params.questionId)
    const stats = await quizStatsCollection.findOne({ questionId: id })
    
    if (!stats) {
      return res.json({ total: 0, correct: 0, percentage: 0 })
    }

    const total = stats.total || 0
    const correct = stats.correct || 0
    const percentage = total ? (correct / total) * 100 : 0
    return res.json({ total, correct, percentage })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// ============== ANALYTICS ENDPOINTS ==============

app.post('/analytics/track', async (req, res) => {
  try {
    const { sessionId, eventType, page, data } = req.body
    if (!sessionId || !eventType) {
      return res.status(400).json({ error: 'sessionId and eventType are required' })
    }

    const event = {
      sessionId,
      eventType,
      page: page || 'unknown',
      timestamp: new Date(),
      data: data || {},
    }

    // Insert event
    await analyticsCollection.insertOne(event)

    // Update or create session (atomic operation)
    const now = new Date()
    await sessionsCollection.updateOne(
      { sessionId },
      {
        $setOnInsert: { sessionId, firstSeen: now },
        $set: { lastSeen: now },
        $inc: { eventsCount: 1 },
      },
      { upsert: true }
    )

    return res.json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/analytics/summary', async (req, res) => {
  try {
    const totalSessions = await sessionsCollection.countDocuments()
    const totalPageViews = await analyticsCollection.countDocuments({ eventType: 'page_view' })

    // Page views by page
    const pageViewsByPageArray = await analyticsCollection.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray()

    const pageViewsByPage = {}
    pageViewsByPageArray.forEach((item) => {
      pageViewsByPage[item._id] = item.count
    })

    // Quiz stats
    const quizStarts = await analyticsCollection.countDocuments({ eventType: 'quiz_start' })
    const quizCompletes = await analyticsCollection.countDocuments({ eventType: 'quiz_complete' })
    const quizAnswerSubmits = await analyticsCollection.countDocuments({ eventType: 'quiz_answer_submit' })

    // Recent sessions
    const recentSessions = await sessionsCollection
      .find()
      .sort({ lastSeen: -1 })
      .limit(10)
      .toArray()

    return res.json({
      totalSessions,
      totalPageViews,
      pageViewsByPage,
      quizStats: {
        starts: quizStarts,
        completions: quizCompletes,
        answersSubmitted: quizAnswerSubmits,
        completionRate: quizStarts > 0 ? ((quizCompletes / quizStarts) * 100).toFixed(2) + '%' : 'N/A',
      },
      recentSessions: recentSessions.map((session) => ({
        sessionId: session.sessionId,
        firstSeen: session.firstSeen,
        lastSeen: session.lastSeen,
        eventsCount: session.eventsCount,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/analytics/details', async (req, res) => {
  try {
    const pageViews = await analyticsCollection.find({ eventType: 'page_view' }).limit(1000).toArray()
    const quizEvents = await analyticsCollection.find({ eventType: { $regex: '^quiz_' } }).limit(1000).toArray()

    return res.json({
      pageViews,
      quizEvents,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// ============== SERVER STARTUP ==============

const PORT = process.env.PORT || 3001

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...')
  await client.close()
  process.exit(0)
})
