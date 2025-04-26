const router = require('express').Router()
const ThanhPho = require('../models/ThanhPhoModel')
const Vung = require('../models/VungModels')

router.get('/getthanhpho/:idvung', async (req, res) => {
  try {
    const idvung = req.params.idvung
    const vung = await Vung.findById(idvung)
    const thanhpho = await Promise.all(
      vung.thanhpho.map(async tp => {
        const tp1 = await ThanhPho.findById(tp._id)
        return {
          _id: tp1._id,
          name: tp1.name,
          mathanhpho: tp1.mathanhpho
        }
      })
    )
    res.json(thanhpho)
  } catch (error) {
    console.error(error)
  }
})

router.get('/getfulltp', async (req, res) => {
  try {
    const vung = await Vung.find().lean()
    const vungjson = await Promise.all(
      vung.map(async v1 => {
        const thanhpho = await Promise.all(
          v1.thanhpho.map(async tp => {
            const tp1 = await ThanhPho.findById(tp._id)
            return {
              name: tp1.name,
              mathanhpho: tp1.mathanhpho
            }
          })
        )
        return {
          idthanhpho: v1._id,
          namevung: v1.name,
          thanhpho: thanhpho
        }
      })
    )
    res.json(vungjson)
  } catch (error) {
    console.error(error)
  }
})

router.post('/postthanhpho/:idvung', async (req, res) => {
  try {
    const idvung = req.params.idvung
    const { name, mathanhpho } = req.body
    const vung = await Vung.findById(idvung)
    const thanhpho = new ThanhPho({ name, mathanhpho })
    await thanhpho.save()
    vung.thanhpho.push(thanhpho._id)
    await vung.save()
    res.json(thanhpho)
  } catch (error) {
    console.error(error)
  }
})

router.post('/putthanhpho/:idthanhpho', async (req, res) => {
  try {
    const idthahpho = req.params.idthanhpho
    const { name, mathanhpho } = req.body
    const thanhpho = await ThanhPho.findById(idthahpho)
    thanhpho.name = name
    thanhpho.mathanhpho = mathanhpho
    await thanhpho.save()
    res.json(thanhpho)
  } catch (error) {
    console.error(error)
  }
})

router.delete('/deletethanhpho', async (req, res) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: 'Không có ID nào được cung cấp để xóa.' })
    }
    const thanhphos = await ThanhPho.find({ _id: { $in: ids } })
    const vungIds = thanhphos.map(tp => tp.vung)
    const vungs = await Vung.find({ _id: { $in: vungIds } })
    for (const vung of vungs) {
      vung.thanhpho = vung.thanhpho.filter(
        tp => !ids.includes(tp._id.toString())
      )
      await vung.save()
    }
    const result = await ThanhPho.deleteMany({ _id: { $in: ids } })
    res.json({
      message: `Đã xóa thành công ${result.deletedCount} thành phố và cập nhật các vùng liên quan.`
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa thành phố.' })
  }
})

router.post('/clearthanhpho', async (req, res) => {
  try {
    await ThanhPho.deleteMany({})
    res.json({ message: 'Xóa toàn bộ thành phố thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa.' })
  }
})

router.post('/importthanhpho', async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('./backup/thanhphos.json', 'utf-8'))

    await ThanhPho.insertMany(data)

    res.json({ message: 'Import dữ liệu thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi import dữ liệu.' })
  }
})

module.exports = router
