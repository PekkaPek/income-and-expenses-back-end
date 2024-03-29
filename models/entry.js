const mongoose = require('mongoose')

const EntrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    min: 0.01,
    max: 99999999,
    required: true
  }
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