const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const vungroutes = require('./routes/VungRoutes')
const thanhphoroutes = require('./routes/ThanhPhoRoutes')
const hangmaybayroutes = require('./routes/HangMayBayRoutes')
const phantramRoutes= require('./routes/PhanTramRoutes')
const theloaiblogRoutes = require('./routes/TheLoaiBlogRoutes')
const blogroutes = require('./routes/BlogRoutes')
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
app.use('/',hangmaybayroutes)
app.use('/', phantramRoutes)
app.use('/',theloaiblogRoutes)
app.use('/',blogroutes)

app.listen(8080, () => {
  try {
    console.log('kết nối thành công 8080')
  } catch (error) {
    console.log('kết nối thất bại 8080', error)
  }
})
