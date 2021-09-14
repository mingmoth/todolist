const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const PORT = 3000

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


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})