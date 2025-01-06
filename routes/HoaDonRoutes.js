const router = require('express').Router()
const HangMayBay = require('../models/HangMayBayModel')
const ThanhPho = require('../models/ThanhPhoModel')
const HoaDon = require('../models/HoaDonModel')

router.get('/gethoadon', async (req, res) => {
  try {
    const hoadon = await HoaDon.find().lean()
    const hoadonjson = await Promise.all(
      hoadon.map(async hoadon1 => {
        const hangmaybay = await HangMayBay.findById(hoadon1.hang)
        const thanhphodi = await ThanhPho.findById(hoadon1.cityfrom)
        const thanhphoto = await ThanhPho.findById(hoadon1.cityto)
        return {
          mahoadon: hoadon1.mahoadon,
          namenguoibay: hoadon1.namenguoibay,
          phone: hoadon1.phone,
          email: hoadon1.email,
          ngaybay: hoadon1.ngaybay,
          hang: hangmaybay.name,
          cityfrom: thanhphodi.name,
          cityto: thanhphoto.name,
          hourfrom: hoadon1.hourfrom,
          hourto: hoadon1.hourto,
          tongtien: hoadon1.tongtien
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
      namenguoibay: hoadon.namenguoibay,
      phone: hoadon.phone,
      email: hoadon.email,
      ngaybay: hoadon.ngaybay,
      hang: hangmaybay.name,
      cityfrom: thanhphodi.name,
      cityto: thanhphoto.name,
      hourfrom: hoadon.hourfrom,
      hourto: hoadon.hourto,
      treem: hoadon.treem,
      tresosinh: hoadon.tresosinh,
      nguoilon: hoadon.nguoilon,
      kygui: hoadon.kygui,
      hanhlykygui: hoadon.hanhlykygui || '',
      pricekygui: hoadon.pricekygui || 0,
      xuathoadon: hoadon.xuathoadon,
      masothue: hoadon.masothue || '',
      tencongty: hoadon.tencongty || '',
      diachi: hoadon.diachi || '',
      ghichu: hoadon.ghichu || '',
      themkhach: hoadon.themkhach,
      sokhachthem: hoadon.sokhachthem || 0,
      tienve: hoadon.tienve,
      tongtien: hoadon.tongtien
    })
  } catch (error) {
    console.error(error)
  }
})

router.post('/posthoadon', async (req, res) => {
  try {
    const {
      namenguoibay,
      phone,
      email,
      ngaybay,
      chuyenbay,
      hang,
      cityfrom,
      cityto,
      hourfrom,
      hourto,
      treem,
      tresosinh,
      nguoilon,
      kygui,
      hanhlykygui,
      pricekygui,
      xuathoadon,
      masothue,
      tencongty,
      diachi,
      ghichu,
      themkhach,
      sokhachthem,
      tienve
    } = req.body
    const thanhphodi = await ThanhPho.findOne({ mathanhpho: cityfrom })
    const thanhphoto = await ThanhPho.findOne({ mathanhpho: cityto })
    const hangmaybay = await HangMayBay.findOne({ mahangmaybay: hang })

    const hoadon = new HoaDon({
      namenguoibay,
      phone,
      email,
      ngaybay,
      chuyenbay,
      hang: hangmaybay._id,
      cityfrom: thanhphodi._id,
      cityto: thanhphoto._id,
      hourfrom,
      hourto,
      treem,
      tresosinh,
      nguoilon,
      kygui,
      pricekygui: 0,
      xuathoadon,
      ghichu,
      themkhach,
      sokhachthem: 0,
      tienve,
      trangthai: 'Chờ thanh toán'
    })
    hoadon.mahoadon = 'HD' + hoadon._id.toString().slice(0, 4)
    if (kygui === true) {
      hoadon.hanhlykygui = hanhlykygui
      hoadon.pricekygui = pricekygui
    }
    if (xuathoadon === true) {
      hoadon.masothue = masothue
      hoadon.tencongty = tencongty
      hoadon.diachi = diachi
    }
    if (themkhach === true) {
      hoadon.sokhachthem = sokhachthem
    }
    const tongtien =
      parseFloat(tienve) +
      parseFloat(pricekygui || 0) +
      (parseFloat(tienve) /
        (parseInt(treem || 0) +
          parseInt(tresosinh || 0) +
          parseInt(nguoilon || 0))) *
        parseInt(sokhachthem || 0)

    hoadon.tongtien = tongtien
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
    } else if (/^[a-fA-F0-9]{24}$/.test(query)) {
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
