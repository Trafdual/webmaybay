const router = require('express').Router()
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
    const phantram1 = await PhanTram.findByIdAndUpdate(idphantram, { phantram })
    res.json(phantram1)
  } catch (error) {
    console.error(error)
  }
})
module.exports = router
