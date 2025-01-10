const express = require('express')
const router = express.Router()
const Voucher = require('../models/VoucherModel')

router.get('/getvoucher', async (req, res) => {
  try {
    const voucher = await Voucher.find().lean()
    res.json(voucher)
  } catch (error) {
    console.error(error)
  }
})

router.post('/postvoucher', async (req, res) => {
  try {
    const { sotien } = req.body
    const voucher = new Voucher({ sotien })
    voucher.mavoucher = 'VC' + voucher._id.toString().slice(-4)
    await voucher.save()
    res.json(voucher)
  } catch (error) {
    console.error(error)
  }
})

router.post('/putvoucher/:idvoucher', async (req, res) => {
  try {
    const idvoucher = req.params.idvoucher
    const { sotien } = req.body
    const voucher = await Voucher.findById(idvoucher)
    voucher.sotien = sotien
    await voucher.save()
    res.json(voucher)
  } catch (error) {
    console.error(error)
  }
})

router.delete('/deletevouchers', async (req, res) => {
  try {
    const { idvouchers } = req.body

    if (!Array.isArray(idvouchers) || idvouchers.length === 0) {
      return res.status(400).json({ error: 'Danh sách ID không hợp lệ' })
    }

    await Voucher.deleteMany({
      _id: { $in: idvouchers }
    })

    res.json({
      message: 'Xóa thành công'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Đã xảy ra lỗi' })
  }
})

router.post('/searchvoucher', async (req, res) => {
  try {
    const { mavoucher } = req.body
    const voucher = await Voucher.findOne({ mavoucher }).lean()
    if (!voucher) {
      return res.json({ message: 'không tìm thấy voucher' })
    }
    res.json(voucher)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
