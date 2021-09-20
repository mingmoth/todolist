const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useUnifiedTopology: true })
// 把這個連線狀態透過 const db = mongoose.connection 儲存到 db 這個物件
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

module.exports = db