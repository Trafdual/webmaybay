const mongoose = require('mongoose')

const hangmaybaySchema = new mongoose.Schema({
  name: { type: String },
  mahangmaybay: { type: String },
  image: { type: String }
})

const hangmaybay = mongoose.model('hangmaybay', hangmaybaySchema)
module.exports = hangmaybay
