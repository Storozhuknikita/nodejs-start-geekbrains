const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: {type: String, required: true},
  completed: {type: Boolean, default: false},
  status: {type: String, default: 'to do'},
  priority: {type: String, default: 'normal'},
})

module.exports = mongoose.model('Task', taskSchema, 'tasks')