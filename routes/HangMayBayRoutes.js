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
      const domain = 'https://webmaybay.vercel.app'
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
      const domain = 'https://webmaybay.vercel.app'

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

router.post('/deletehang/:id', async (req, res) => {
  try {
    const id = req.params.id
    await HangMayBay.findByIdAndDelete(id)
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
