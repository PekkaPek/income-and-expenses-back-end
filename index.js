const express = require('express')
const entriesRouter = require('./controllers/entries')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const credentials = require('./credentials')

const url = `mongodb://${credentials.username}:${credentials.password}@ds149732.mlab.com:49732/income-expenses-app-development`
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useFindAndModify: false
  }
)
  .then( () => {
    console.log('Connected to database', url)
  })
  .catch( error => {
    console.log(error)
  })

app.use(cors())
app.use(bodyParser.json())
app.use('/api/entries', entriesRouter)

const PORT = 3002
app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})