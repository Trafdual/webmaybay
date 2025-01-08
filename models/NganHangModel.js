const mongoose = require('mongoose')

const nganhangSchema = new mongoose.Schema({
  tennganhang: { type: String },
  tendaydu: { type: String },
  tentaikhoan: { type: String },
  sotaikhoan: { type: String },
  chinhanh: { type: String },
  image: { type: String }
})

const nganhang = mongoose.model('nganhang', nganhangSchema)
module.exports = nganhang
