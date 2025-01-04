const mongoose = require('mongoose')

const theloaiblogSchema = new mongoose.Schema({
  name: { type: String },
  blog: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }]
})

const theloaiblog = mongoose.model('theloaiblog', theloaiblogSchema)
module.exports = theloaiblog
