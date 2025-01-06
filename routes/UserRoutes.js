const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/UserModel')

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, password: hashedPassword, role })
    await user.save()
    res.json(user)
  } catch (error) {
    console.error(error)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user) {
      res.json({ message: 'tên đăng nhập không chính xác' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.json({ message: 'nhập sai mật khẩu' })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
