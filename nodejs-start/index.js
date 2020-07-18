//Common JS

const ansi = require('ansi')

//Создание курсора
const cursor = ansi(process.stdout)

cursor
.white()
.bg.green()
.write('Hello World')
.reset()
.bg.reset()
.write('\n');
