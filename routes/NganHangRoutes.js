const router = require('express').Router()
const NganHang = require('../models/NganHangModel')
const upload = require('./upload')
router.get('/getnganhang', async (req, res) => {
  try {
    const nganhang = await NganHang.find().lean()
    res.json(nganhang)
  } catch (error) {
    console.error(error)
  }
})

router.post(
  '/postnganhang',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { tennganhang, tendaydu, tentaikhoan, sotaikhoan, chinhanh } =
        req.body
     
      const image = req.files['image']
        ? `${req.files['image'][0].filename}`
        : null

      const nganhang = new NganHang({
        tennganhang,
        tendaydu,
        tentaikhoan,
        sotaikhoan,
        chinhanh,
        image
      })
      await nganhang.save()
      res.json(nganhang)
    } catch (error) {
      console.error(error)
    }
  }
)

router.post(
  '/putnganhang/:id',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { tennganhang, tendaydu, tentaikhoan, sotaikhoan, chinhanh } =
        req.body
      const id = req.params.id
      
      const image = req.files['image']
        ? `${req.files['image'][0].filename}`
        : null

      const nganhang = await NganHang.findById(id)

      nganhang.tennganhang = tennganhang
      nganhang.tendaydu = tendaydu
      nganhang.tentaikhoan = tentaikhoan
      nganhang.sotaikhoan = sotaikhoan
      nganhang.chinhanh = chinhanh
      if (image) {
        nganhang.image = image
      }
      await nganhang.save()
      res.json(nganhang)
    } catch (error) {
      console.error(error)
    }
  }
)

router.post('/deletenganhang', async (req, res) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách id không hợp lệ' })
    }
    await NganHang.deleteMany({ _id: { $in: ids } })
    res.json({ message: 'Xóa ngan hang thanh cong' })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
