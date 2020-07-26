const http = require('http')
const url = require('url')

http.createServer((req, res) => {
    const message = {
        name: 'Anna',
        text: 'Hello!',
    }

    const query = url.parse(req.url, true)
    console.log(query)

    res.writeHead(200, {
        'Content-type': 'application/json',
    })

    res.write(JSON.stringify(message))
    res.end()
}).listen(4000)

