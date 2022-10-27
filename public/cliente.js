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
    mostra('tela-login')
  })

  O('botao-menu-meuAlbum').addEventListener('click', function () {
    mostra('tela-mostra-album')
  })

  O('botao-menu-figurinhasTrocar').addEventListener('click', function () {
    mostra('tela-mostra-atualizaTrocas')
  })

  O('botao-menu-figurinhasMinhas').addEventListener('click', function () {
    mostra('tela-atualizaAlbum')
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
