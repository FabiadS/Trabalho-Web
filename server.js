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

const wss = new WebSocket.Server({ port: 8000 }, function () {
  console.log('O servidor de websockets esta rodando na porta 8000')
})

var clientesOnline = []
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    var m = JSON.parse(message)

    switch (m.tipo) {
      case 'login':
        if (m.id == 'aluno' && m.passwd == 'aluno') {
          // sucesso
          ws.login = m.id
          ws.send(JSON.stringify({ tipo: 'login', valor: 'sucesso' }))
          clientesOnline.push(ws)
          console.log(
            'Cliente aceito. Atualmente existem ' +
              clientesOnline.length +
              ' cliente(s) online'
          )
        } else {
          ws.send(JSON.stringify({ tipo: 'login', valor: 'falha' }))
          console.log('Recebeu mensagem de login:recusado')
          ws.close()
        }
        break
    }
  })
  ws.on('close', function (code) {
    for (let x = 0; x < clientesOnline.length; x++) {
      if (clientesOnline[x] == ws) {
        clientesOnline.splice(x, 1)
        break
      }
    }

    console.log(
      'Cliente desconectou. Atualmente existem ' +
        clientesOnline.length +
        ' cliente(s) online'
    )
  })
})
