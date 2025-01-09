const router = require('express').Router()
const HangMayBay = require('../models/HangMayBayModel')
const upload = require('./upload')

router.get('/gethangmaybay', async (req, res) => {
  try {
    const hangmaybay = await HangMayBay.find().lean()
    res.json(hangmaybay)
  } catch (error) {
    console.error(error)
  }
})

router.post(
  '/posthangmaybay',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, mahangmaybay } = req.body
      const domain = 'https://demovemaybay.shop'
      const image = req.files['image']
        ? `${domain}/${req.files['image'][0].filename}`
        : null

      const hangmaybay = new HangMayBay({
        name,
        mahangmaybay,
        image
      })
      await hangmaybay.save()
      res.json(hangmaybay)
    } catch (error) {
      console.error(error)
    }
  }
)

router.post(
  '/puthangmaybay/:idhang',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res) => {
    try {
      const idhang = req.params.idhang
      const { name, mahangmaybay } = req.body
      const domain = 'https://demovemaybay.shop'

      const image = req.files['image']
        ? `${domain}/${req.files['image'][0].filename}`
        : null

      const hangmaybay = await HangMayBay.findById(idhang)
      hangmaybay.name = name
      hangmaybay.mahangmaybay = mahangmaybay
      if (image) {
        hangmaybay.image = image
      }
      await hangmaybay.save()
      res.json(hangmaybay)
    } catch (error) {
      console.error(error)
    }
  }
)

router.post('/deletehang', async (req, res) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách id không hợp lệ' })
    }

    await HangMayBay.deleteMany({ _id: { $in: ids } })

    res.json({ message: 'Xóa thành công các hãng máy bay' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa các hãng máy bay' })
  }
})

module.exports = router
