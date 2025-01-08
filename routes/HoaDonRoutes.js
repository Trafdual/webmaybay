const router = require('express').Router()
const HangMayBay = require('../models/HangMayBayModel')
const ThanhPho = require('../models/ThanhPhoModel')
const HoaDon = require('../models/HoaDonModel')
const momenttimezone = require('moment-timezone')
const moment = require('moment')

router.get('/gethoadon', async (req, res) => {
  try {
    const hoadon = await HoaDon.find().lean()
    const hoadonjson = await Promise.all(
      hoadon.map(async hoadon1 => {
        return {
          mahoadon: hoadon1.mahoadon,
          namelienhe: hoadon1.namelienhe,
          phone: hoadon1.phone,
          email: hoadon1.email,
          ngaybay: hoadon1.ngaybay,
          ngayve: hoadon1.ngayve || '',
          chuyenbay: hoadon1.chuyenbay,
          chuyenbayve: hoadon1.chuyenbayve,
          tongtien: hoadon1.tongtien,
          trangthai: hoadon1.trangthai,
          ngaytao: moment(hoadon1.ngaytao).format('DD-MM-YYYY')
        }
      })
    )
    res.json(hoadonjson)
  } catch (error) {
    console.error(error)
  }
})

router.get('/getchitiethoadon/:id', async (req, res) => {
  try {
    const id = req.params.id
    const hoadon = await HoaDon.findById(id).lean()
    const hangmaybay = await HangMayBay.findById(hoadon.hang)
    const thanhphodi = await ThanhPho.findById(hoadon.cityfrom)
    const thanhphoto = await ThanhPho.findById(hoadon.cityto)
    res.json({
      mahoadon: hoadon.mahoadon,
      namelienhe: hoadon.namelienhe,
      phone: hoadon.phone,
      email: hoadon.email,
      ngaybay: hoadon.ngaybay,
      ngayve: hoadon.ngayve || '',
      hangve: hoadon.hangve || '',
      chuyenbayve: hoadon.chuyenbayve || '',
      hourvefrom: hoadon.hourvefrom || '',
      hourveto: hoadon.hourto || '',
      tienveve: hoadon.tienveve || '',
      hang: hangmaybay.name,
      cityfrom: thanhphodi.name,
      cityto: thanhphoto.name,
      hourfrom: hoadon.hourfrom,
      hourto: hoadon.hourto,
      xuathoadon: hoadon.xuathoadon,
      masothue: hoadon.masothue || '',
      tencongty: hoadon.tencongty || '',
      diachi: hoadon.diachi || '',
      ghichu: hoadon.ghichu || '',
      tienve: hoadon.tienve,
      tongtien: hoadon.tongtien,
      ngaytao: moment(hoadon.ngaytao).format('DD-MM-YYYY'),
      khachbay: hoadon.khachbay
    })
  } catch (error) {
    console.error(error)
  }
})

router.post('/posthoadon', async (req, res) => {
  try {
    const {
      namelienhe,
      phone,
      email,
      ngaybay,
      chuyenbay,
      hang,
      cityfrom,
      cityto,
      hourfrom,
      hourto,
      xuathoadon,
      masothue,
      tencongty,
      diachi,
      ghichu,
      tienve,
      ngayve,
      hangve,
      chuyenbayve,
      hourvefrom,
      hourveto,
      tienveve,
      khachhangs
    } = req.body
    const thanhphodi = await ThanhPho.findOne({ mathanhpho: cityfrom })
    const thanhphoto = await ThanhPho.findOne({ mathanhpho: cityto })
    const hangmaybay = await HangMayBay.findOne({ mahangmaybay: hang })

    const hoadon = new HoaDon({
      namelienhe,
      phone,
      email,
      ngaybay,
      chuyenbay,
      cityfrom: thanhphodi._id,
      cityto: thanhphoto._id,
      hourfrom,
      hourto,
      xuathoadon,
      ghichu,
      tienve,
      trangthai: 'Chờ thanh toán',
      ngaytao: momenttimezone().toDate()
    })
    if (hangmaybay) {
      hoadon.hang = hangmaybay._id
    }

    hoadon.khachbay = khachhangs.map(
      ({ namebay, doituong, kygui, hanhlykygui, pricekygui }) => ({
        namebay,
        doituong,
        kygui,
        hanhlykygui,
        pricekygui
      })
    )
    const totalPricekygui = khachhangs.reduce((total, khach) => {
      return total + (parseFloat(khach.pricekygui) || 0)
    }, 0)

    hoadon.mahoadon = 'HD' + hoadon._id.toString().slice(0, 4)
    if (xuathoadon === true) {
      hoadon.masothue = masothue
      hoadon.tencongty = tencongty
      hoadon.diachi = diachi
    }
    let tongtien = parseFloat(tienve) + totalPricekygui
    if (ngayve) {
      hoadon.ngayve = ngayve
      hoadon.hangve = hangve
      hoadon.chuyenbayve = chuyenbayve
      hoadon.hourvefrom = hourvefrom
      hoadon.hourveto = hourveto
      hoadon.tienveve = tienveve
      tongtien += parseFloat(tienveve)
    }

    hoadon.tongtien = tongtien
    await hoadon.save()
    res.json(hoadon)
  } catch (error) {
    console.error(error)
  }
})

router.post('/postthanhtoan/:mahoadon', async (req, res) => {
  try {
    const mahoadon = req.params.mahoadon
    const hoadon = await HoaDon.findOne({ mahoadon })
    hoadon.trangthai = 'Đã thanh toán'
    await hoadon.save()
    res.json(hoadon)
  } catch (error) {
    console.error(error)
  }
})

router.post('/searchhoadon', async (req, res) => {
  try {
    const { query } = req.body
    if (!query) {
      return res
        .status(400)
        .json({ error: 'Vui lòng nhập số điện thoại hoặc mã hóa đơn.' })
    }

    let condition
    if (/^\d{10,11}$/.test(query)) {
      condition = { phone: query }
    } else if (/^[a-zA-Z0-9]+$/.test(query)) {
      condition = { mahoadon: query }
    } else {
      return res.status(400).json({ error: 'Dữ liệu nhập không hợp lệ.' })
    }

    const hoadon = await HoaDon.findOne(condition)

    if (!hoadon) {
      return res.status(404).json({ error: 'Không tìm thấy hóa đơn phù hợp.' })
    }

    res.json(hoadon)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm hóa đơn.' })
  }
})

module.exports = router
