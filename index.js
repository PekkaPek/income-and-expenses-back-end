const express = require('express')
const mongoose = require('mongoose')
const credentials = require('./credentials.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())

const url = `mongodb://${credentials.username}:${credentials.password}@ds149732.mlab.com:49732/income-expenses-app-development`
mongoose.connect(url, { useNewUrlParser: true })

const EntrySchema = new mongoose.Schema({
  type: String,
  date: Date,
  amount: Number
})

EntrySchema.statics.formalize = function (entry) {
  return({
    id: entry._id,
    type: entry.type,
    amount: entry.amount,
    date: entry.date
  })
}

const Entry = mongoose.model('Entry', EntrySchema)

let entries = [
  {
    id: 1,
    type: 'expense',
    date: new Date('2019-01-01'),
    amount: 1.99
  },
  {
    id: 2,
    type: 'expense',
    date: new Date('2019-02-09'),
    amount: 1.85
  },
  {
    id: 3,
    type: 'income',
    date: new Date('2019-02-04'),
    amount: 45
  },
  {
    id: 4,
    type: 'income',
    date: new Date('2019-02-12'),
    amount: 0.65
  }
]

let nextId = 5

app.get('/api/entries', (req,res) => {
  let entriesByMonth = []
  if (req.query.y && req.query.m) {
    const providedYear = Number(req.query.y)
    const providedMonth = Number(req.query.m)
    entriesByMonth = entries.filter(entry => {
      if (entry.date.getFullYear() === providedYear) {
        return entry.date.getMonth() === providedMonth
      } else {
        return false
      }
    })
  } else {
    const currentMonth = new Date().getMonth()
    entriesByMonth = entries.filter(entry => entry.date.getMonth() === currentMonth)
  }
  res.json(entriesByMonth)
})

app.post('/api/entries', (req, res) => {
  const newEntry = new Entry({
    amount: req.body.amount,
    date: new Date(req.body.date),
    type: req.body.type
  })
  newEntry
    .save()
    .then(savedEntry => {
      mongoose.connection.close()
      res.status(201).json(Entry.formalize(savedEntry))
    })
})

app.put('/api/entries', (req, res) => {
  const modifiedEntry = req.body
  const originalEntry = entries.find(entry => entry.id === modifiedEntry.id)
  if(!originalEntry) {
    return res.status(404).json({error: 'id is not found'} )
  }
  entryToBeSaved = {...modifiedEntry, date: new Date(modifiedEntry.date)}
  entries = entries.map(entry => entry.id !== entryToBeSaved.id ? entry : entryToBeSaved)
  res.json(entryToBeSaved)
})

app.delete('/api/entries/:id', (req, res) => {
  const id = Number(req.params.id)
  removedEntry = entries.find(entry => entry.id === id)
  if(!removedEntry) {
    return res.status(404).json({error: 'id is not found'} )
  }
  entries = entries.filter(entry => entry.id !== id)
  res.json(removedEntry)
})

const PORT = 3002
app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})