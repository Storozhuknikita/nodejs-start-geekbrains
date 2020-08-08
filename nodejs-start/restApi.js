const express = require('express')
const cors = require('cors') // TODO
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const SECRET_KEY = 'aklsjdlaskjdlakjoiqwueoiquwom123123jklqmweoiqweqiwe'

var config = require('./config') // настройки

mongoose.connect(`mongodb://127.0.0.1:${config.mongoosePort}/todo`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}) // соединение с базой

const taskModel = require('./models/task')
const userModel = require('./models/user')
const passport = require('./auth')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false})) // для обработки формы
app.use(cors())

const checkAuth = (req, res, next) => {
    if(req.headers.authorization){
        const [type, token] = req.headers.authorization.split(' ')
        
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if(err){
                return res.status(403).send()
            }

            // Расшифровываем токен
            req.user = decoded;
            next();
        })
    }else{
        return res.status(403).send()
    }
}

app.use('/tasks', checkAuth)

// вывод всех задач
app.get('/tasks', async (req, res) => {
    const tasks = await taskModel.find({}).lean()
    res.status(200).json(tasks)
})

// добавление задачи
app.post('/tasks', async (req, res) => {
    const task = new taskModel(req.body)
    const isSaved = await task.save()
    res.status(200).json(isSaved)
})

// вывод одной задачи
app.get('/tasks/:id', async(req, res) => {
    const {id} = req.params
    const task = await taskModel.findById(id)
    res.status(200).json(task)  
});

// Для авторизации и регистрации
// Сама регистрация механика
app.post('/register', async (req, res) => {
    const { repassword, ...restBody } = req.body
    if(restBody.password === repassword){
        const user = new userModel(restBody)
        await user.save()
        res.status(201).send()
    }else{
        res.status(400).json({message: 'Usr exists'})
    }
})

// Авторизация
app.post('/auth', async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(401).send()
    }

    if(!user.validatePassword(password)){
        return res.status(401).send()
    }

    const plainUser = JSON.parse(JSON.stringify(user))

    delete plainUser.password

    res.status(200).json({
        ...plainUser,
        token: jwt.sign(plainUser, SECRET_KEY),
    })

})

// запуск
app.listen(config.webPort, () => console.log('=========== Server Start ==========='))