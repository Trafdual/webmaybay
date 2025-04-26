const router = require('express').Router()
const phantram = require('../models/PhanTramModel')
const PhanTram = require('../models/PhanTramModel')

router.get('/getphantram', async (req, res) => {
  try {
    const phantram = await PhanTram.find().lean()
    res.json(phantram)
  } catch (error) {
    console.error(error)
  }
})

router.post('/postphantram', async (req, res) => {
  try {
    const { phantram } = req.body
    const phantram1 = new PhanTram({ phantram })
    await phantram1.save()
    res.json(phantram1)
  } catch (error) {
    console.error(error)
  }
})

router.post('/putphantram/:idphantram', async (req, res) => {
  try {
    const { phantram } = req.body
    const idphantram = req.params.idphantram
    const phantram1 = await PhanTram.findByIdAndUpdate(
      idphantram,
      {
        phantram: phantram
      },
      { new: true }
    )
    res.json(phantram1)
  } catch (error) {
    console.error(error)
  }
})

router.post('/clearphantram', async (req, res) => {
  try {
    await PhanTram.deleteMany({})
    res.json({ message: 'Xóa toàn bộ phần trăm thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa.' })
  }
})

router.post('/importphantram', async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('./backup/phantrams.json', 'utf-8'))

    await PhanTram.insertMany(data)

    res.json({ message: 'Import dữ liệu thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi import dữ liệu.' })
  }
})


module.exports = router
