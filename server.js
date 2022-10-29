const WebSocket = require("ws");

var express = require("express");
const { json } = require("express");
var app = express();

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";
var dbo;

MongoClient.connect(
  url,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err, db) {
    if (err) {
      console.log("Erro conectando com o servidor de BD");
    } else console.log("Conectado ao BD");
    dbo = db.db("figurinhas"); // O banco de dadoos se chama " figurinhas"
  }
);
app.use(express.static(__dirname + "/public"));

app.get(/^(.+)$/, function (req, res) {
  try {
    res.write("A pagina que vc busca nao existe");
    res.end();
  } catch (e) {
    res.end();
  }
});

app.listen(3000, function () {
  console.log(
    "SERVIDOR WEB na porta 3000. O cliente precisa acessar via browser http://[IP]:3000 para acessar a aplicacao"
  );
});

const wss = new WebSocket.Server({ port: 8000 }, function () {
  console.log("O servidor de websockets esta rodando na porta 8000");
});

var clientesOnline = [];
wss.on("connection", async function connection(ws) {
  ws.on("message", async function incoming(message) {
    var m = JSON.parse(message);
    switch (m.tipo) {
      case "login": {
        ws.id = m.id;
        ws.passwd = m.passwd;
        query = { email: ws.id, senha: ws.passwd };
        console.log(ws.id);
        if (m.id == "" || m.passwd == "") {
          ws.send(JSON.stringify({ tipo: "login", valor: "falha" }));
          console.log("Recebeu mensagem de login: recusado");
          ws.close();
        } else {
          dbo
            .collection("Usuarios")
            .find(query)
            .limit(1)
            .toArray(function (err, result) {
              if (err) throw err;
              if (result[0] == undefined) {
                ws.send(JSON.stringify({ tipo: "login", valor: "falha" }));
                console.log("Recebeu mensagem de login: recusado");
                console.log("nao existe usuario");
                ws.close();
              } else {
                for (var a = 0; a < result.length; a++) {
                  console.log(
                    "Achou usuario ",
                    result[a].email + " " + result[a].nome
                  );
                }
              }
            });
          ws.send(JSON.stringify({ tipo: "login", valor: "sucesso" }));
          clientesOnline.push(ws);
          console.log(
            "Cliente aceito. Atualmente existem " +
            clientesOnline.length +
            " cliente(s) online"
          );
        }
        break;
      }

      case "trocarFigurinha": {
        if(!ws.id)
        {
          ws.send(JSON.stringify({ tipo: "trocarFigurinha", valor: "falha3"}))
          ws.close()
          break
        }

        ws.figtrocas = m.figtrocas

        if(m.figtrocas == null)
        {
          ws.send(JSON.stringify({tipo: "trocarFigurinha", valor: "falha2"}));
          console.log("Figurinhas recusado");
          ws.close();
        }else{
          ws.send(
            JSON.stringify({ tipo: "trocarFigurinha", valor: "sucessotrocar" })
          );
          

          var newValues = {$set: {email: ws.id, figurinha_rep:ws.figtrocas}}
          var query = {email: ws.id}

          dbo.collection("Usuarios").find(query).limit(1).toArray(function (err, result) {
            console.log("olá")
            if(err) throw err;
            if(result[0] == undefined) {
              ws.send(JSON.stringify({ tipo: "trocarFigurinha", valor: "falha2" }));
              console.log("Usuário não encontrado");
            }else{
              for (var a = 0; a < result.length; a++) {
                fig_atual = result[a].figurinha_rep
                console.log(
                "Achou usuario " +
                result[a].figurinha_rep
              );
              var myquery = {figurinha_rep: fig_atual}
            }
            }
          })
          console.log("Imprimindo id do troca figurinhas" + ws.id)
          dbo.collection("Usuarios").updateOne(myquery, newValues, function(err, res){
            if(err) throw err;
            console.log("1 document updated");
            console.log("sucesso trocando figurinhas");
          })
        }

        break
      }

      
      case "cadastro":
        ws.id = m.id;
        ws.passwd = m.passwd;
        ws.nome = m.nome;
        ws.cidade = m.cidade;
        ws.estado = m.estado;
        ws.telefone = m.telefone;
        let figurinha_rep = null
        let figurinha_preciso = null
        info = {
          email: ws.id,
          senha: ws.passwd,
          nome: ws.nome,
          cidade: ws.cidade,
          estado: String(ws.estado).toUpperCase(),
          telefone: ws.telefone,
          figurinha_rep,
          figurinha_preciso
        };

        console.log(info);

        if (
          ws.id == "" ||
          ws.passwd == "" ||
          m.nome == "" ||
          m.cidade == "" ||
          m.estado == "" ||
          m.telefone == ""
        ) {
          ws.send(JSON.stringify({ tipo: "cadastro", valor: "falha" }));
          console.log("Recebeu mensagem de cadastro: recusado");
          ws.close();
        } else {
          dbo.collection("Usuarios").insertOne(info, function (err, result) {
            if (err) {
              console.log("erro inserindo elemento");
            } else {
              console.log("1 document inserted");
            }
            ws.send(
              JSON.stringify({ tipo: "cadastro", valor: "cadastro_okay" })
            );
          });
        }
        break;
    }
  });
  ws.on("close", function (code) {
    for (let x = 0; x < clientesOnline.length; x++) {
      if (clientesOnline[x] == ws) {
        clientesOnline.splice(x, 1);
        break;
      }
    }

    console.log(
      "Cliente desconectou. Atualmente existem " +
      clientesOnline.length +
      " cliente(s) online"
    );
  });
});