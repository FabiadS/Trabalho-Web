const WebSocket = require('ws')

var express = require('express')
var app = express()

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017'
var dbo

MongoClient.connect(
  url,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err, db) {
    if (err) {
      console.log('Erro conectando com o servidor de BD')
    } else console.log('Conectado ao BD')
    dbo = db.db('figurinhas') // O banco de dadoos se chama " figurinhas"
  }
)

app.get(/^(.+)$/, (req, res) => {
  try {
    res.write('A pagina que vc busca nao existe')
    res.end()
  } catch (e) {
    res.end()
  }
})

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`))
