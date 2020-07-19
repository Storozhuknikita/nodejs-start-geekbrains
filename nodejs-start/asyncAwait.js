// async await

async function myFunc(){
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve('Успешное выполнение!'), 1000)
    })

    let result = promise;
    console.log(result)
}

myFunc()


class Waiter {

    async wait(){
        return await Promise.resolve(1)
    }
}

new Waiter().wait().then((result) => {console.log(result)})