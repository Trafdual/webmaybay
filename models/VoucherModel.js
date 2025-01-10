const mongoose = require('mongoose')

const voucherSchema = new mongoose.Schema({
  mavoucher: { type: String },
  sotien: { type: Number }
})

const voucher = mongoose.model('voucher', voucherSchema)
module.exports = voucher
