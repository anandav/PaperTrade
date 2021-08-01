const static = require('node-static');
const http = require('http')
const fs = require('fs')
const httpPort = 8080
const distFolder = new static.Server('./dist');

http.createServer((req, res) => {
  fs.readFile('index.html', 'utf-8', (err, content) => {
    if (err) {
      console.log('We cannot open "index.html" file.')
      //distFolder.serve(req, res);
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    })

    res.end(content)
  })
}).listen(httpPort, () => {
  console.log('Server listening on: http://localhost:%s', httpPort)
})


// const static = require('node-static');
// const http = require('http');
// const httpPort = 8181
// const distFolder = new static.Server('./dist');

// http.createServer(function (req, res) {
//   distFolder.serve(req, res);
// }).listen(httpPort, () => {
//   console.log('Server listening on: http://localhost:%s', httpPort)
// })
