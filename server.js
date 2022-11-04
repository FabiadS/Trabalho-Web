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


      case "faltamFigurinha": {
        if (!ws.id) {
          ws.send(JSON.stringify({ tipo: "faltamFigurinha", valor: "falha3" }))
          ws.close()
          break
        }

        ws.figfaltam = m.figfaltam;
        var newValues = { $set: { figurinha_preciso: ws.figfaltam } }
        var query = { email: ws.id }

        //teste
        if (m.figfaltam == null) {
          ws.send(JSON.stringify({ tipo: "faltamFigurinha", valor: "falha2" }));
          console.log("Figurinhas recusado");
          ws.close();
        } else {
          ws.send(
            JSON.stringify({ tipo: "faltamFigurinha", valor: "sucessofaltam" })
          );

          dbo.collection("Usuarios").updateOne(query, newValues, function (err, res) {
            console.log("figurinhas que preciso inseridas");
          })

          console.log("Imprimindo id do faltam figurinhas" + ws.id)

        }
        break
      }

      case "trocarFigurinha": {
        if (!ws.id) {
          ws.send(JSON.stringify({ tipo: "trocarFigurinha", valor: "falha3" }))
          ws.close()
          break
        }

        ws.figtrocas = m.figtrocas;
        var newValues = { $set: { figurinha_rep: ws.figtrocas } }
        var query = { email: ws.id }

        //teste
        if (m.figtrocas == null) {
          ws.send(JSON.stringify({ tipo: "trocarFigurinha", valor: "falha2" }));
          console.log("Figurinhas recusado");
          ws.close();
        } else {
          ws.send(
            JSON.stringify({ tipo: "trocarFigurinha", valor: "sucessotrocar" })
          );

          dbo.collection("Usuarios").updateOne(query, newValues, function (err, res) {
            console.log("figurinhas que quero trocar inseridas");
          })

          console.log("Imprimindo id do troca figurinhas" + ws.id)

        }
        break
      }

      case 'match': {
        console.log("print ws.id " + ws.id)
        query = { email: ws.id }
        pessoas_troca = []
        console.log("query é " + query)
        if (!ws.id) {
          console.log("entrou aqui")
          ws.send(JSON.stringify({ tipo: "match", valor: "falha" }))
          ws.close()
          break
        }
        else {
          dbo
            .collection("Usuarios")
            .find(query)
            .limit(1000)
            .toArray(function (err, result) {
              if (err) throw err;
              if (result[0] == undefined) {
                ws.send(JSON.stringify({ tipo: "match", valor: "falha" }));
                console.log("Não tem usuário cadastrado com essa cidade");
                ws.close();
              } else {
                for (var a = 0; a < result.length; a++) {
                  console.log(
                    "Achou usuario ",
                    result[a].email + " " + result[a].cidade
                  );
                  query_estado = result[a].estado
                  query_cidade = result[a].cidade
                  query_fig_rep = result[a].figurinha_rep
                  query_fig_preciso = result[a].figurinha_preciso
                  if (result[a].figurinha_preciso == null || result[a].figurinha_rep == null) {
                    tam_fig_rep = 0
                    tam_fig_preciso = 0
                  } else {
                    tam_fig_rep = Object.values(result[a].figurinha_rep).length
                    tam_fig_preciso = Object.values(result[a].figurinha_preciso).length
                  }
                  console.log(query_estado)
                }
              dbo.collection("Usuarios").find({ cidade: query_cidade, estado: query_estado}).toArray(function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    for (var i = 0; i < result.length; i++) {
                      if (result[i].email != ws.id) {
                        for (var a = 0; a < tam_fig_preciso; a++) {
                          if (result[i].figurinha_rep != null) {
                            for (var b = 0; b < Object.values(result[i].figurinha_rep).length; b++) {
                              if (result[i].figurinha_rep[b] == query_fig_preciso[a]) {
                                pessoas_troca.push({
                                  nome: result[i].nome,
                                  cidade: result[i].cidade,
                                  telefone: result[i].telefone,
                                  figurinha_rep: result[i].figurinha_rep,
                                  figurinha_preciso: result[i].figurinha_preciso
                                })
                                console.log("Primeiro Match")
                                continue
                              }
                            }
                          }
                        }
                      }
                      for (var a = 0; a < tam_fig_rep; a++) {
                        for (var b = 0; b < pessoas_troca.length; b++) {
                          console.log(query_fig_preciso[a])
                          console.log(pessoas_troca[b].figurinha_preciso)
                          if (pessoas_troca[b].figurinha_preciso == query_fig_rep[a]) {
                            console.log(pessoas_troca[b].nome)
                            continue
                          }
                        }
                      }
                    }
                    }
                });
                if (pessoas_troca.length == 0) {
                  ws.send(JSON.stringify({ tipo: "match", valor: "falha" }));
                  console.log("Verifique suas figurinhas");
                }
                else {
                  ws.send(JSON.stringify({ tipo: "match", valor: "sucesso_match" }));
                }
              }
            });
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
          cidade: String(ws.cidade).toUpperCase(),
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