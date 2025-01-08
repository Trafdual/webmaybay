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
      const domain = 'https://demovemaybay.shop'
      const image = req.files['image']
        ? `${domain}/${req.files['image'][0].filename}`
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

module.exports = router
