setTimeout(() =>{
    console.log('setTimeout()')
}, 1000)

console.log('After setTimeout()')

function sendToServer(callback){
    setTimeout(() => {
        const result = 5000
        callback(null, result)
    }, 1000)
}

sendToServer((err, res) => {
    if(err){
        throw err
    }

    // А тут работа с результатом
})