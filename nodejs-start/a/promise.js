const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({name: 'Anna'})
    })
})

promise.then((user) =>{
    //console.log(user)

    // Запрос 2
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(user) // через замыкание
            user.colors = ['red', 'white', 'black']
            resolve(user)
        }, 1000)
    })
}, // on fullfield
//() => {}, // onRejected
).then((user) => {
    console.log(user)
})

promise.catch(() => {})

promise.finally(() => {
    console.log('finally')
})
