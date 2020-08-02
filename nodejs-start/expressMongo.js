const express = require('express')
const consolidate = require('consolidate')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

const taskMongoose = require('./models/taskMongo');

mongoose.connect('mongodb://127.0.0.1:27017/todo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


// какой шаблонизатор используется
app.engine('hbs', consolidate.handlebars)
// какой формат используется
app.set('view engine', 'hbs')
// путь к папке с шаблонами
app.set('views', path.resolve(__dirname, 'views'))
//Middleware для работы с form
app.use(express.urlencoded({extended: false}))
//Для работы с JSON
app.use(express.json())

// задачи
app.get('/tasks', async(req, res) => {
    const tasks = await taskMongoose.find({})
    //res.json(tasks)
    res.render('tasks', tasks)  
});

// добавление задачи
app.post('/tasks', async (req, res) => {
    const task = new taskMongoose(req.body)
    const isSaved = await task.save()
    res.json(tasks)
})



// 
app.listen(4000, () => {
    console.log('The server has been started!')
})