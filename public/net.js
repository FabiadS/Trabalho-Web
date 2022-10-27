// Modulo de comunicacao via websockets

var servidorWebserver = 'ws://localhost:8000'

var websocket

function enviaLogin(id, passwd) {
  websocket.send(JSON.stringify({ tipo: 'login', id: id, passwd: passwd }))
}

function enviaFigurinha(figtrocas) {
  websocket.send(JSON.stringify({ tipo: 'trocarFigurinha', figtrocas: figtrocas }))
}
function enviaCadastro(id, passwd, nome, cidade, estado, telefone) {
  websocket.send(JSON.stringify({ tipo: 'cadastro', id: id, passwd: passwd, nome: nome, cidade: cidade, estado: estado, telefone: telefone }))
}

function fazLogout() {
  try {
    websocket.close()
  } catch (e) { }
}

function startConnection(id, passwd) {
  websocket = new ReconnectingWebSocket(servidorWebserver)
  websocket.onopen = function (evt) {
    enviaLogin(id, passwd)
  }
  websocket.onclose = function (evt) {
    onClose(evt)
  }
  websocket.onmessage = function (evt) {
    onMessage(evt)
  }
  websocket.onerror = function (evt) {
    onError(evt)
  }
}

function trocar(figTrocar) {
  websocket = new ReconnectingWebSocket(servidorWebserver)
  websocket.onopen = function (evt) {
    enviaFigurinha(figTrocar)
  }
}
function cadastro(email, senha, nome, cidade, estado, telefone) {
  websocket = new ReconnectingWebSocket(servidorWebserver)
  websocket.onopen = function (evt) {
    enviaCadastro(email, senha, nome, cidade, estado, telefone)
  }
  websocket.onclose = function (evt) {
    onClose(evt)
  }
  websocket.onmessage = function (evt) {
    onMessage(evt)
  }
  websocket.onerror = function (evt) {
    onError(evt)
  }
}

function onClose(evt) {}

function onMessage(evt) {
  var msg = evt.data
  msg = JSON.parse(msg)
  console.log(msg)

  switch (msg.tipo) {
    case 'login':
      if (msg.valor == 'sucesso') {
        mostra('tela-mostra-menu')
      } else {
        mostra('tela-falha')
        websocket.close()
        setTimeout(function () {
          mostra('tela-login')
        }, 3000)
      }

      break

    case 'trocarFigurinha':
      if (msg.valor == 'sucessotrocar') {
        mostra('tela-sucesso-atualizar-figurinhas')
        console.log("net - case trocar")
      } else {
        mostra('tela-falha')
        websocket.close()
        setTimeout(function () {
          mostra('tela-login')
        }, 3000)
      }
      break
    break
    case 'cadastro':
      if(msg.valor == 'cadastro_okay')
      {
        mostra('tela-login')
      }else{
          mostra('tela-falha')
          websocket.close()
          setTimeout(function () {
            mostra('tela-login')
          }, 3000)
      }
    break
  }
}

function onError(evt) {
  console.log(evt)
}
