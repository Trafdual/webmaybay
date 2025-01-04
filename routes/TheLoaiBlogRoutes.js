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

router.post('/deletetheloaiblog/:idtheloaiblog', async (req, res) => {
  try {
    const idtheloaiblog = req.params.idtheloaiblog
    const theloaiblog = await TheLoaiBlog.findById(idtheloaiblog)
    await Promise.all(
      theloaiblog.blog.map(async bl => {
        await Blog.findByIdAndDelete(bl._id)
      })
    )
    await TheLoaiBlog.findByIdAndDelete(idtheloaiblog)
    res.json({mesage:'Xóa thành công'})
  } catch (error) {}
})

module.exports = router
