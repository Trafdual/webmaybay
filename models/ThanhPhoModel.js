const mongoose = require('mongoose')

const thanhphoSchema = new mongoose.Schema({
  name: { type: String },
  mathanhpho: { type: String },
  vung: { type: mongoose.Schema.Types.ObjectId, ref: 'vung' }
})

const ThanhPho = mongoose.model('thanhpho', thanhphoSchema)
module.exports = ThanhPho
