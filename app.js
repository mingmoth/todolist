const express = require('express')
const exphbs = require('express-handlebars')
const Todo = require('./models/todo')
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
app.use(express.urlencoded({ extended: true }))

// display total todo
app.get('/', (req, res) => {
  Todo.find().lean().sort({_id: 'asc'})
    .then((todos) => {
      res.render('index', { todos })
    })
    .catch(err => console.log(err))
})

// direct to create page
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

// create new todo
app.post('/todos', (req, res) => {
  const name = req.body.name
  Todo.create({ name })
    .then(() => { res.redirect('/') })
    .catch(err => console.log(err))
})

// check detail todo
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id).lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(err => console.log(err))
})

// display edit page
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  Todo.findById(id).lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(err => console.log(err))
})

// save edit page
app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const {name, isDone} = req.body
  Todo.findById(id)
    .then((todo) => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => { res.redirect(`/todos/${id}`) })
    .catch(err => console.log(err))
})

//delete todo
app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})