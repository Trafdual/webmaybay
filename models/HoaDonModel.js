const mongoose = require('mongoose')

const hoadonSchema = new mongoose.Schema({
  mahoadon: { type: String },
  namenguoibay: { type: String },
  phone: { type: String },
  email: { type: String },
  ngaybay: { type: Date },
  hang: { type: mongoose.Schema.Types.ObjectId, ref: 'hangmaybay' },
  cityfrom: { type: mongoose.Schema.Types.ObjectId, ref: 'thanhpho' },
  cityto: { type: mongoose.Schema.Types.ObjectId, ref: 'thanhpho' },
  hourfrom: { type: String },
  hourto: { type: String },
  treem:{type:Number},
  tresosinh:{type:Number},
  nguoilon:{type:Number},
  kygui: { type: Boolean, default: false },
  hanhlykygui: { type: String },
  pricekygui:{type:Number},
  xuathoadon: { type: Boolean, default: false },
  masothue: { type: String },
  tencongty: { type: String },
  diachi: { type: String },
  ghichu: { type: String },
  themkhach: { type: Boolean, default: false },
  sokhachthem:{type:Number},
  tienve: { type: Number },
  tongtien:{type:Number},
})

const hoadon = mongoose.model('hoadon', hoadonSchema)
module.exports = hoadon
