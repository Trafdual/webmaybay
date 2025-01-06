const express = require('express')
const router = express.Router()
const TheLoaiBlog = require('../models/TheLoaiBlog')
const Blog = require('../models/BlogModel')

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

router.get('/getchitietblog/:idblog',async(req,res)=>{
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
        return {
          _id: blog1._id,
          tieude: blog1.tieude
        }
      })
    )
    res.json(blog)
  } catch (error) {
    console.error(error)
  }
})

router.post('/deleteblog/:idblog', async (req, res) => {
  try {
    const idblog = req.params.idblog
    const blog = await Blog.findById(idblog)
    const theloai = await TheLoaiBlog.findById(blog.theloaiblog)
    theloai.blog = theloai.blog.filter(b => b._id != blog._id)
    await theloai.save()
    await Blog.findByIdAndDelete(idblog)
    res.json(blog)
  } catch (error) {
    console.error(error)
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
          tieude: blog1.tieude
        }
      })
    )
    res.json(blog)
  } catch (error) {
    console.error(error)
  }
})
module.exports = router
