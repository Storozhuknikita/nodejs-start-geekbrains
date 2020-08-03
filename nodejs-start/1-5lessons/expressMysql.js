const express = require('express')
const consolidate = require('consolidate')
const path = require('path')

const app = express()

const taskMysql = require('./models/taskMysql.js');
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


app.get('/tasks', async(req, res) => {
    const tasks = await taskMysql.getAll()
    res.json(tasks)
});

app.listen(4000, () => {
    console.log('The server has been started!')
})