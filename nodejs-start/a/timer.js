const timerInterval = setInterval(() => {
    console.log('setInterval')
}, 1000)

//console.log(timerInterval)

//clearInterval(timeInterval) // так же как и в JS

// Очистка таймера NodeJS
timerInterval.unref()

// Снова возобновляем таймер
timerInterval.ref()
