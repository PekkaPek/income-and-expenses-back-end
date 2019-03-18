const express = require('express')
const Entry = require('./models/entry')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/api/entries', (req,res) => {
  let searchedYear = new Date().getFullYear()
  let searchedMonth = new Date().getMonth() + 1
  if (req.query.y && req.query.m) {
    if ( req.query.y >= 1970 && req.query.y <= 2100) {
      if (req.query.m >= 0 && req.query.m <= 11) {
        searchedYear = Number(req.query.y)
        searchedMonth = Number(req.query.m) + 1
      } else {
        return res.status(400).json({ error: "Provided month must be between 0 and 11" })
      }
    } else {
      return res.status(400).json({ error: "Provided year must be between 1970 and 2100" })
    }
  }
  Entry
    .aggregate([
    {
      $addFields: {
        "year": {$year: '$date'},
        "month": {$month: '$date'}
      }
    },
    {
      $match: {
        year: searchedYear,
        month: searchedMonth
      }
    },
    {
      $sort: {date: 1}
    }
  ])
    .then(entries => {
    const entriesFormalized = entries.map(entry => Entry.formalize(entry))
    res.json(entriesFormalized)
    })
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
      res.status(201).json(Entry.formalize(savedEntry))
    })
    .catch( error => {
      res.status(400).json({ error: error.message })
    })
})

app.patch('/api/entries', (req, res) => {
  const body = req.body
  const buildObjectFromBody = body => ({
    ...body.type && { type: body.type},
    ...body.amount && { amount: body.amount},
    ...body.date && { date: body.date}
  })
  const modifiedEntry = buildObjectFromBody(body)
  Entry
    .findByIdAndUpdate(body.id, modifiedEntry, { runValidators: true, new: true })
    .then(updatedNote => {
      if (updatedNote) {
        res.json(Entry.formalize(updatedNote))
      } else {
        res.status(404).json({ error: 'Entry with provided id is not found' })
      }
    })
    .catch(error => {
      console.log('error:', error)
      res.status(400).json({ error: error.message })
    })
})

app.delete('/api/entries/:id', (req, res) => {
  const id = req.params.id
  Entry
    .findByIdAndDelete(id)
    .then(removedEntry => {
      if (removedEntry) {
        res.json(Entry.formalize(removedEntry))
      } else {
        res.status(404).json({ error: 'Entry with specified id is not found'})
      }
    })
    .catch(error => {
      console.log('error:', error)
      res.status(400).json({ error: 'Entry id is malformatted' })
    })
})

const PORT = 3002
app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})