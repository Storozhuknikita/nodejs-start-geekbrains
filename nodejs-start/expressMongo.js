const express = require('express')
const consolidate = require('consolidate')
const path = require('path') 
const mongoose = require('mongoose') // для работы с базой
var config = require('./config') // настройки

const app = express() // создаем приложение

const taskMongoose = require('./models/taskMongo'); // подключаем модель

mongoose.connect(`mongodb://127.0.0.1:${config.mongoosePort}/todo`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}) // соединение с базой

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

app.get('/', (req, res) => {
    res.send("Hello world!")
});

// задачи вывод, подготовка формата
app.get('/tasks', async(req, res) => {
    const tasksHelper = await taskMongoose.find({})
    const tasks = [];
    for (let i of tasksHelper){
        tasks.push({
            title: i.title,
            status: i.status,
            priority: i.priority,
            priorityKey: i.priority === 'high' ? 1 : 0,
            id: i._id
        })
    }

    res.render("tasks", {tasks})  
});

// добавление данных
app.post('/tasks', async (req, res) => {
    const task = new taskMongoose(req.body)
    await task.save()
    res.redirect('/tasks')
})

// Обновление данных
app.put('/tasks', async (req, res) => {
    if(!req.body) return res.sendStatus(400)
    const { id, title, status, priority } = req.body
    const task = await taskMongoose.findById( id )
  
    const updatedTask = { 
      title: title ? title : task.title,
      status: status ? status : task.status, 
      priority: priority ? priority : task.priority, 
    }
       
    taskMongoose.updateOne({_id: id}, updatedTask, {new: true}, function(err, task){
      if(err) return console.log(err)
    })
    
    res.redirect('/tasks')
})

// удаление задачи
app.delete('/tasks', async (req, res) => {
    if(!req.body) return res.sendStatus(400)

    await taskMongoose.findByIdAndDelete({_id: req.body.id}, function(err, task){
        if(err) return console.log(err)
    })

    res.redirect('/tasks')
})


// подключение статики для доступа с браузера
app.use(express.static(path.join(__dirname, 'views', 'styles'))) 

app.listen(config.webPort, () => console.log('=========== Server Start ==========='))