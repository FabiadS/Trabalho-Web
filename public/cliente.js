window.addEventListener('DOMContentLoaded', event => {
  mostra('tela-login')
  O('tela-login-entra').addEventListener('click', function () {
    let id = O('tela-login-ID').value
    let passwd = O('tela-login-passwd').value
    startConnection(id, passwd)
  })

  O('tela-login-cadastro').addEventListener('click', function () {
    mostra('tela-mostra-cadastro')
  })

  O('tela-cadastro-cadastrar').addEventListener('click', function () {
    let email = O('tela-cadastro-ID').value
    let senha = O('tela-cadastro-passwd').value
    let nome = O('tela-cadastro-nome').value
    let cidade = O('tela-cadastro-cidade').value
    let estado = O('tela-cadastro-estado').value
    let telefone = O('tela-cadastro-telefone').value
    cadastro(email, senha, nome, cidade, estado, telefone)
  })

  O('tela-cadastro-voltar').addEventListener('click', function () {
    mostra('tela-login')
  })

  O('botao-menu-match').addEventListener('click', function () {
    let id = O('tela-login-ID').value
    enviarDados(id)
    console.log("match")
  })

  O('botao-menu-figurinhasTrocar').addEventListener('click', function () {
    mostra('tela-mostra-atualizaTrocas')
    console.log('botao menu trocar figurinhas')
  })

  O('botao-atualizaTrocas').addEventListener('click', function () {
    let figTrocar = O('input-atualizaTrocas').value
    let vector = figTrocar.split(',').join('')
    trocar(vector)
    console.log('input trocar figurinhas')
  })

  O('botao-menu-figurinhasMinhas').addEventListener('click', function () {
    mostra('tela-atualizaAlbum')
    console.log('botao menu figurinhas minhas')
  })


  O('botao-atualizaFaltam').addEventListener('click', function () {
    let figQuero = O('input-atualizaFaltam').value
    let vector = figQuero.split(',').join('')
    faltam(vector)
    console.log('input faltam figurinhas')
  })


  O('voltar_menu').addEventListener('click', function () {
    mostra('tela-mostra-menu')
  })


  O('botao-menu-logout').addEventListener('click', function () {
    fazLogout()
    mostra('tela-login')
  })

  const buttons = document.querySelectorAll('.retorna-menu')

  buttons.forEach(function (currentBtn) {
    currentBtn.addEventListener('click', function () {
      mostra('tela-mostra-menu')
    })
  })
})
