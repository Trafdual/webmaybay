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

router.delete('/deletevoucher/:idvoucher', async (req, res) => {
  try {
    const idvoucher = req.params.idvoucher
    await Voucher.findByIdAndDelete(idvoucher)
    res.json({ message: 'Xóa thành công' })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
