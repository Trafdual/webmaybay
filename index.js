const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
// const fs = require('fs')
const MongoStore = require('connect-mongo')
const vungroutes = require('./routes/VungRoutes')
const thanhphoroutes = require('./routes/ThanhPhoRoutes')
const hangmaybayroutes = require('./routes/HangMayBayRoutes')
const phantramRoutes = require('./routes/PhanTramRoutes')
const theloaiblogRoutes = require('./routes/TheLoaiBlogRoutes')
const blogroutes = require('./routes/BlogRoutes')
const hoadonRoutes = require('./routes/HoaDonRoutes')
const userRoutes = require('./routes/UserRoutes')
const nganhangroutes = require('./routes/NganHangRoutes')
const voucherroutes = require('./routes/VoucherRoutes')
// const HangMayBay = require('./models/HangMayBayModel')
// const PhanTram = require('./models/PhanTramModel')
// const Vung = require('./models/VungModels')
// const NganHang = require('./models/NganHangModel')
// const Blog = require('./models/BlogModel')
// const ThanhPho = require('./models/ThanhPhoModel')
// const TheLoaiBlog = require('./models/TheLoaiBlog')
// const User = require('./models/UserModel')
// const VouCher = require('./models/VoucherModel')
// const HoaDon = require('./models/HoaDonModel')

var app = express()
app.use(methodOverride('_method'))

const uri =
  'mongodb+srv://baongocxink03:KD3qvAqFfpKC1uzX@cluster0.aocmw.mongodb.net/webmaybay?retryWrites=true&w=majority'

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log('kết nối thành công'))

const mongoStoreOptions = {
  mongooseConnection: mongoose.connection,
  mongoUrl: uri,
  collection: 'sessions'
}

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions),
    cookie: {
      secure: false
    }
  })
)
app.use(cors())
app.use(express.static(path.join(__dirname, '/uploads')))



app.use('/', vungroutes)
app.use('/', thanhphoroutes)
app.use('/', hangmaybayroutes)
app.use('/', phantramRoutes)
app.use('/', theloaiblogRoutes)
app.use('/', blogroutes)
app.use('/', hoadonRoutes)
app.use('/', userRoutes)

app.use('/', nganhangroutes)
app.use('/', voucherroutes)

// Backup specific collection using Mongoose model
// mongoose.connection.on(
//   'error',
//   console.error.bind(console, 'MongoDB connection error:')
// )
// mongoose.connection.once('open', async () => {
//   console.log('Successfully connected to MongoDB Atlas')

//   try {
//     // Sử dụng mô hình Mongoose để truy xuất dữ liệu từ collection 'VouCher'
//     const data = await HoaDon.find({}).exec()

//     // Kiểm tra dữ liệu có tồn tại không
//     if (data.length === 0) {
//       console.log('No data found in the collection.')
//       return
//     }

//     // Hàm chuyển đổi ObjectId thành định dạng JSON có thể tái sử dụng
//     const convertObjectId = obj => {
//       if (obj instanceof mongoose.Types.ObjectId) {
//         return { $oid: obj.toString() }
//       }
//       if (Array.isArray(obj)) {
//         return obj.map(convertObjectId)
//       }
//       if (obj && typeof obj === 'object') {
//         return Object.entries(obj).reduce((acc, [key, value]) => {
//           acc[key] = convertObjectId(value)
//           return acc
//         }, {})
//       }
//       return obj
//     }

//     // Áp dụng chuyển đổi cho dữ liệu
//     const transformedData = data.map(doc => convertObjectId(doc.toObject()))

//     // Thư mục backup
//     const backupDir = path.join(__dirname, 'backup')
//     if (!fs.existsSync(backupDir)) {
//       fs.mkdirSync(backupDir)
//     }

//     // Lưu dữ liệu vào file JSON
//     const filePath = path.join(backupDir, 'hoadons.json')
//     fs.writeFileSync(filePath, JSON.stringify(transformedData, null, 2))

//     console.log('Backup completed for collection: VouCher')
//   } catch (error) {
//     console.error('Error during backup:', error)
//   } finally {
//     // Ngắt kết nối sau khi hoàn tất
//     mongoose.disconnect()
//   }
// })



app.listen(3013, () => {
  try {
    console.log('kết nối thành công 3013')
  } catch (error) {
    console.log('kết nối thất bại 3013', error)
  }
})
