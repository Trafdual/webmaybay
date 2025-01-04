const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  tieude: { type: String },
  noidung:{type:String},
  theloaiblog: { type: mongoose.Schema.Types.ObjectId, ref: 'theloaiblog' }
})

const blog = mongoose.model('blog', blogSchema)
module.exports = blog
