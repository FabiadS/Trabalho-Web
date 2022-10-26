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
