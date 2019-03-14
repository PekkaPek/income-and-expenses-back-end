const mongoose = require('mongoose')
const credentials = require('../credentials')

const url = `mongodb://${credentials.username}:${credentials.password}@ds149732.mlab.com:49732/income-expenses-app-development`
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useFindAndModify: false
  }
)

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

module.exports = Entry