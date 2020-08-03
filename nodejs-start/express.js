const express = require('express')
const consolidate = require('consolidate')
const path = require('path') 
const mongoose = require('mongoose') // для работы с базой
var config = require('./config') // настройки

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)


const app = express() // создаем приложение

const taskModel = require('./models/task'); // подключаем модель
const userModel = require('./models/user'); // подключаем модель User
const passport = require('./auth') // подключаем модуль авторизации

mongoose.connect(`mongodb://127.0.0.1:${config.mongoosePort}/todo`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}) // соединение с базой

// какой шаблонизатор используется
app.engine('hbs', consolidate.handlebars)
app.set('view engine', 'hbs')
app.set('views', path.resolve(__dirname, 'views'))

//Middleware для работы с form
app.use(express.urlencoded({extended: false}))

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: '1234',
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

app.use(passport.initialize)
app.use(passport.session)


//Для работы с JSON
app.use(express.json())

// Проверка авторизации
app.use('/tasks', passport.mustBeAutheticated)

app.get('/', (req, res) => {
    res.redirect('/tasks')
});

// вывод задач
app.get('/tasks', async (req, res) => {
    const tasksObj = await taskModel.find({})
    const tasks = JSON.parse(JSON.stringify(tasksObj))
    res.render('tasks', {tasks})
})

// добавление задачи
app.post('/tasks', async (req, res) => {
    const task = new taskModel(req.body)
    const isSaved = await task.save()
    res.redirect('tasks')
})

// редактирование задачи
app.post('/tasks/update', async (req, res) => {
    const { id, title } = req.body

    await taskModel.updateOne({_id: id}, {$set: {title}})
    res.redirect('/tasks')
})

// задача завершена
app.post('/tasks/complete', async (req, res) => {
    const {id} = req.body
    await taskModel.updateOne({_id: id}, {$set: { completed: true }})
    res.redirect('/tasks')
})

// задача удалена
app.post('/tasks/remove', async (req, res) => {
    const {id} = req.body
    await taskModel.findByIdAndRemove(id)
    res.redirect('/tasks')
})

// вывод одной задачи
app.get('/tasks/:id', async(req, res) => {
    const {id} = req.params
    const task = await taskModel.findById(id)
    res.render('task', task)  
});


// Registration Auth
// Форма регистрации
app.get('/register', (req, res) => {
    res.render('register')
})
// Сама регистрация механика
app.post('/register', async (req, res) => {
    const { repassword, ...restBody } = req.body
    if(restBody.password === repassword){
        const user = new userModel(restBody)
        await user.save()
        res.redirect('/auth')
    }else{
        res.redirect('/register?err=repass')
    }
})

// Форма авторизации
app.get('/auth', (req, res) => {
    const {error} = req.query
    res.render('auth', {error})
})

// Авторизация
app.post('/auth', passport.authenticate)

// Выход
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/auth')
})


// подключение статики для доступа с браузера
app.use(express.static(path.join(__dirname, 'views', 'styles'))) 

// запуск
app.listen(config.webPort, () => console.log('=========== Server Start ==========='))