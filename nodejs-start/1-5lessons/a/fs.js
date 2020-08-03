// работа с файлами

const fs = require('fs')

// синхронно
//const data = fs.readFileSync('./env.js', 'utf-8')
//console.log(data)


// асинхронно (указывать кодировку можно но не обязательно)
fs.readFile('./env.js', 'utf-8' (err, data) => {
    if(err){
        throw err
    }

    // преобразование toString - если нет кодировки
    console.log('Async', data.toString())
})

