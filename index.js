const express = require('express')
const entriesRouter = require('./controllers/entries')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use('/api/entries', entriesRouter)

const PORT = 3002
app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})