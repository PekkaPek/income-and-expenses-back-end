const express = require('express')
const app = express()

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

app.get('/api/entries', (req,res) => {
  res.json(entries)
})

const PORT = 3002
app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})