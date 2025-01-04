const mongoose = require('mongoose')

const phantramSchema = new mongoose.Schema({
  phantram: { type: Number }
})

const phantram = mongoose.model('phantram', phantramSchema)
module.exports = phantram
