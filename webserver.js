var express = require('express')
var app = express()
var port = 3700

// tell express where to find templates
app.set('views', __dirname + '/templates')
// tell express where to find files
app.use(express.static(__dirname + '/public'))

// set the render engine so that we can use templates
app.set('view engine', 'pug')
app.engine('pug', require('pug').__express)

// tell express what page to render when people go to our base page
app.get('/', function (req, res) {
  res.render('game')
})

// Handle 404 - Keep this as a last route
app.use(function (req, res, next) {
  res.status(400)
  res.send('404: File Not Found')
})

// tell express what port to listen on, that's the "(app.listen(port)" part
require('socket.io').listen(app.listen(port))// done like this so that socket io can be sent when rendering

console.log('Listening on port ' + port)
