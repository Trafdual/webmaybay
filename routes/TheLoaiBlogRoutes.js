const express = require('express')
const router = express.Router()
const TheLoaiBlog = require('../models/TheLoaiBlog')
const Blog = require('../models/BlogModel')

router.get('/gettheloaiblog', async (req, res) => {
  try {
    const theloaiblog = await TheLoaiBlog.find().lean()
    res.json(theloaiblog)
  } catch (error) {
    console.error(error)
  }
})

router.post('/posttheloaiblog', async (req, res) => {
  try {
    const { name } = req.body
    const theloaiblog = new TheLoaiBlog({ name })
    await theloaiblog.save()
    res.json(theloaiblog)
  } catch (error) {
    console.error(error)
  }
})

router.post('/puttheloaiblog/:idtheloaiblog', async (req, res) => {
  try {
    const idtheloaiblog = req.params.idtheloaiblog
    const { name } = req.body
    const theloaiblog = await TheLoaiBlog.findById(idtheloaiblog)
    theloaiblog.name = name
    await theloaiblog.save()
    res.json(theloaiblog)
  } catch (error) {
    console.error(error)
  }
})

router.post('/deletetheloaiblogs', async (req, res) => {
  try {
    const { ids } = req.body
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Danh sách ID không hợp lệ' })
    }

    const theloaiblogs = await TheLoaiBlog.find({
      _id: { $in: ids }
    })
    const allBlogIds = theloaiblogs.flatMap(tl => tl.blog.map(bl => bl._id))

    await Blog.deleteMany({ _id: { $in: allBlogIds } })

    await TheLoaiBlog.deleteMany({ _id: { $in: ids } })

    res.json({ message: 'Xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi khi xóa dữ liệu' })
  }
})

router.post('/cleartheloaiblog', async (req, res) => {
  try {
    await TheLoaiBlog.deleteMany({})
    res.json({ message: 'Xóa toàn bộ thể loại thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa.' })
  }
})

router.post('/importtheloaiblog', async (req, res) => {
  try {
    const data = JSON.parse(
      fs.readFileSync('./backup/theloaiblogs.json', 'utf-8')
    )

    await TheLoaiBlog.insertMany(data)

    res.json({ message: 'Import dữ liệu thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi import dữ liệu.' })
  }
})

module.exports = router
