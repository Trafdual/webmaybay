const router = require('express').Router()
const Vung = require('../models/VungModels')
const ThanhPho = require('../models/ThanhPhoModel')

router.get('/getvung', async (req, res) => {
  try {
    const vung = await Vung.find().lean()
    res.json(vung)
  } catch (error) {
    console.error(error)
  }
})

router.post('/postvung', async (req, res) => {
  try {
    const { name } = req.body
    const vung = new Vung({ name })
    await vung.save()
    res.json(vung)
  } catch (error) {
    console.error(error)
  }
})

router.post('/putvung/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { name } = req.body
    const vung = await Vung.findById(id)
    vung.name = name
    await vung.save()
    res.json(vung)
  } catch (error) {
    console.error(error)
  }
})

router.post('/deletevung/:id', async (req, res) => {
  try {
    const id = req.params.id
    const vung = await Vung.findById(id)
    await Promise.all(
      vung.thanhpho.map(async tp => {
        await ThanhPho.findOneAndDelete(tp._id)
      })
    )
    await Vung.findByIdAndDelete(id)
    res.json({ message: 'Xóa thành công' })
  } catch (error) {
    console.error(error)
  }
})

router.post('/clearvung', async (req, res) => {
  try {
    await Vung.deleteMany({})
    res.json({ message: 'Xóa toàn bộ Vung thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa.' })
  }
})

router.post('/importvung', async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('./backup/vungs.json', 'utf-8'))

    await Blog.insertMany(data)

    res.json({ message: 'Import dữ liệu thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi import dữ liệu.' })
  }
})


module.exports = router
