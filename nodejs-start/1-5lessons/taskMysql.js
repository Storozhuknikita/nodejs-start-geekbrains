const mysql = require('mysql');
const { connect } = require('http2');
const { reject, resolve } = require('bluebird');

// Вариант 1
/*const connection = mysql.createConnection({
    host: 'localhost',
    database: 'todo',
    user: 'root',
    password: '1234'
});

connection.query((err) => {
    connection.query('')
});*/

// Вариант 2
const pool = mysql.createPool({
    host: 'localhost',
    database: 'todo',
    user: 'root',
    password: 'password',
    connectionLimit: 3,
    waitForConnections: true, // Если свободных соединений в pool нет - то пользователь будет ждать
})



class Task {
    static getAll(){
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    reject(err)
                }

                // Запрос
                pool.query('SELECT * FROM tasks', (err, rawRows) => {
                    if(err){
                        reject(err)
                    }

                    const rows = JSON.parse(JSON.stringify(rawRows)) // возвращаем

                    connection.release() // Возвращаем соединение обратно в pull
                    resolve(rows)
                })
            })
        })
    }

    static addEventListener(task){
        // реализация
    }
}

module.exports = Task;