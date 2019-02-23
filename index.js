const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

let entries = [
  {
    id: 1,
    type: 'expense',
    date: new Date('2019-02-01'),
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
  res.json(entries)
})

app.post('/api/entries', (req, res) => {
  const newEntry = req.body
  newEntry.date = new Date()
  newEntry.id = nextId++
  entries = entries.concat(newEntry)
  res.status(201).json(newEntry)
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