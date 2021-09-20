const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

//display create page
router.get('/new', (req, res) => {
  res.render('new')
})
//create new todo
router.post('/', (req, res) => {
  const { name, isDone } = req.body
  Todo.create({name})
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

//display detail page
router.get('/:id', (req, res) => {
  const id = req.params.id
  Todo.findById(id).lean()
    .then((todo) => res.render('detail', {todo}))
    .catch(err => console.log(err))
})

//display edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id).lean()
    .then((todo) => res.render('edit', {todo}))
    .catch(err => console.log(err))
})

//Save edit result
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

//delete todo
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then((todo) => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router