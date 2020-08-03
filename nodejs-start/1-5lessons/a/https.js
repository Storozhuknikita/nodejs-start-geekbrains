const https = require('https')

https.get('https://geekbrains.ru', (res) => {
    console.log('Response code:', res.statusCode)
    
    res.setEncoding('utf-8')

    let data = '';

    res.on('data', (chunk) => {
        console.log(chunk)
        data += chunk
    })

    res.on('end', () => {
        console.log('Finish!')
        //console.log('Data: ', data)
    })
}).on('error', (err) => {
    console.log('Error:', err)
})