var readline = require('readline');
var fs = require('fs');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var sideCoin = [["1", "Орел"], ["2", "Решка"]];

function start() {
    console.log('Введите 1 (Орел), 2 (Решка) или q (выход):');
}

start();

rl.on('line', function (cmd) {
    var rand = Math.floor(Math.random() * sideCoin.length);

    if (cmd === 'q') {
        this.close();
    } else {
        var string;
        if ((cmd === '1') || (cmd === '2') || (cmd === 'q')) {
            console.log('Вы выбрали "' + cmd + '", Компьютер выбрал "' + sideCoin[rand][0] + '"');
            if (cmd === sideCoin[rand][0]) {
                console.log('Урааа! Вы выиграли!');
                string = "Win\n";
            } else {
                console.log('Упс. Вы проиграли.');
                string = "Loss\n";
            }

            fs.appendFile('homework2-log.txt', string, function (err) {
                if (err) {
                    throw err;
                }
            });
        } else {
            console.log('Вы ввели что то не то');
        }
        start();
    }
});