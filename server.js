import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const STATS_PATH = path.join(__dirname, 'quizStats.json')

const app = express()
app.use(express.json())

// Simple CORS headers so the React dev server can call this API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

async function readStats() {
  try {
    const raw = await fs.readFile(STATS_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') {
      // create empty file
      await writeStats({})
      return {}
    }
    throw err
  }
}

async function writeStats(obj) {
  await fs.writeFile(STATS_PATH, JSON.stringify(obj, null, 2), 'utf8')
}

app.post('/submit', async (req, res) => {
  try {
    const { questionId, gotItRight } = req.body
    if (typeof questionId === 'undefined' || typeof gotItRight === 'undefined') {
      return res.status(400).json({ error: 'questionId and gotItRight are required' })
    }

    const id = String(questionId)
    const stats = await readStats()
    if (!stats[id]) stats[id] = { correct: 0, total: 0 }

    stats[id].total = (stats[id].total || 0) + 1
    if (gotItRight) stats[id].correct = (stats[id].correct || 0) + 1

    await writeStats(stats)

    const total = stats[id].total || 0
    const correct = stats[id].correct || 0
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
    const stats = await readStats()
    if (!stats[id]) return res.json({ total: 0, correct: 0, percentage: 0 })

    const total = stats[id].total || 0
    const correct = stats[id].correct || 0
    const percentage = total ? (correct / total) * 100 : 0
    return res.json({ total, correct, percentage })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Ensure quizStats.json exists on startup
;(async () => {
  try {
    await readStats()
  } catch (err) {
    console.error('Could not initialize quiz stats file:', err)
  }
})()

const PORT = 3001
app.listen(PORT, () => console.log(`Quiz stats server listening on http://localhost:${PORT}`))
