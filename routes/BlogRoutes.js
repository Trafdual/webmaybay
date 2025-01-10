const express = require('express')
const router = express.Router()
const TheLoaiBlog = require('../models/TheLoaiBlog')
const Blog = require('../models/BlogModel')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const moment = require('moment')

router.get('/getblog', async (req, res) => {
  try {
    const theloaiblog = await TheLoaiBlog.find().lean()
    const blogjson = await Promise.all(
      theloaiblog.map(async theloai => {
        const blog = await Promise.all(
          theloai.blog.map(async bl => {
            const blog1 = await Blog.findById(bl._id)
            return {
              _id: blog1._id,
              tieude: blog1.tieude
            }
          })
        )
        return {
          _id: theloai._id,
          name: theloai.name,
          blog: blog
        }
      })
    )
    res.json(blogjson)
  } catch (error) {
    console.error(error)
  }
})

router.get('/getchitietblog/:idblog', async (req, res) => {
  try {
    const idblog = req.params.idblog
    const blog = await Blog.findById(idblog)
    res.json(blog)
  } catch (error) {
    console.error(error)
  }
})

router.post('/postblog/:idtheloai', async (req, res) => {
  try {
    const idtheloai = req.params.idtheloai
    const { tieude, noidung } = req.body
    const theloai = await TheLoaiBlog.findById(idtheloai)
    const blog = new Blog({ tieude, noidung })
    blog.theloaiblog = theloai._id
    theloai.blog.push(blog._id)
    await blog.save()
    await theloai.save()
    res.json(blog)
  } catch (error) {
    console.error(error)
  }
})

router.get('/getblog/:namtheloai', async (req, res) => {
  try {
    const nametheloai = req.params.namtheloai
    const theloai = await TheLoaiBlog.findOne({ name: nametheloai })
    const blog = await Promise.all(
      theloai.blog.map(async bl => {
        const blog1 = await Blog.findById(bl._id)
        const createdAt = new mongoose.Types.ObjectId(blog1._id).getTimestamp()

        let descripton = ''
        if (blog1.noidung) {
          const $ = cheerio.load(blog1.noidung)
          $('h1, h2, h3, h4, h5, h6').remove()
          const paragraphs = $('p')
            .filter(function () {
              return $(this).text().trim().length > 0
            })
            .map(function () {
              return $(this).text().trim()
            })
            .get()

          descripton = paragraphs[0] || ''
        }

        return {
          _id: blog1._id,
          tieude: blog1.tieude,
          descripton: descripton,
          date: moment(createdAt.toISOString()).locale('vi').format('DD [Tháng] MM [năm] YYYY')
        }
      })
    )
    res.json(blog)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Đã xảy ra lỗi' })
  }
})

router.post('/deleteblogs', async (req, res) => {
  try {
    const { idblogs } = req.body

    if (!idblogs || !Array.isArray(idblogs)) {
      return res.status(400).json({ message: 'Danh sách ID không hợp lệ' })
    }

    const blogs = await Blog.find({ _id: { $in: idblogs } })

    const theloaiIds = [...new Set(blogs.map(blog => blog.theloaiblog))]

    const theloais = await TheLoaiBlog.find({ _id: { $in: theloaiIds } })
    theloais.forEach(theloai => {
      theloai.blog = theloai.blog.filter(
        blog => !idblogs.includes(blog._id.toString())
      )
    })

    await Promise.all(theloais.map(theloai => theloai.save()))

    await Blog.deleteMany({ _id: { $in: idblogs } })

    res.json({ message: 'Xóa thành công', deletedBlogs: idblogs })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi khi xóa dữ liệu' })
  }
})

router.get('/getblogid/:idtheloai', async (req, res) => {
  try {
    const idtheloai = req.params.idtheloai
    const theloai = await TheLoaiBlog.findById(idtheloai)
    const blog = await Promise.all(
      theloai.blog.map(async bl => {
        const blog1 = await Blog.findById(bl._id)
        return {
          _id: blog1._id,
          tieude: blog1.tieude,
          noidung: blog1.noidung
        }
      })
    )
    res.json(blog)
  } catch (error) {
    console.error(error)
  }
})

router.post('/putblog/:idblog', async (req, res) => {
  try {
    const idblog = req.params.idblog
    const { tieude, noidung } = req.body
    const blog = await Blog.findById(idblog)
    blog.tieude = tieude
    blog.noidung = noidung
    await blog.save()
    res.json(blog)
  } catch (error) {
    console.error(error)
  }
})
module.exports = router
