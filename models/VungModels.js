const mongoose = require('mongoose')

const vungSchema = new mongoose.Schema({
  name: { type: String },
  thanhpho: [{ type: mongoose.Schema.Types.ObjectId, ref: 'thanhpho' }]
})

const Vung = mongoose.model('vung', vungSchema)
module.exports = Vung
