const mongoose = require('mongoose')

const hoadonSchema = new mongoose.Schema({
  mahoadon: { type: String },
  namelienhe: { type: String },
  phone: { type: String },
  email: { type: String },
  ngaybay: { type: String },
  hang: { type: String },
  chuyenbay: { type: String },
  cityfrom: { type: String },
  cityto: { type: String },
  hourfrom: { type: String },
  hourto: { type: String },
  ngayve: { type: String },
  hangve: { type: String },
  chuyenbayve: { type: String },
  hourvefrom: { type: String },
  hourveto: { type: String },
  tienveve: { type: Number },
  xuathoadon: { type: Boolean, default: false },
  masothue: { type: String },
  tencongty: { type: String },
  diachi: { type: String },
  ghichu: { type: String },
  tienve: { type: Number },
  tongtien: { type: Number },
  trangthai: { type: String },
  ngaytao: { type: Date },
  khachbay: [
    {
      namebay: { type: String },
      doituong: { type: String },
      kygui: { type: Boolean, default: false },
      hanhlykygui: { type: String },
      pricekygui: { type: Number }
    }
  ],
  datghe: { type: Boolean, default: false },
  ghe: { type: String },
  tiendatghe: { type: Number },
  mavoucher:{type:String}
})

const hoadon = mongoose.model('hoadon', hoadonSchema)
module.exports = hoadon
