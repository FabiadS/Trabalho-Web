// Modulo de interface grafica

function O(msg) {
  return document.getElementById(msg)
}

function mostra(m) {
  const todos = document.getElementsByClassName('tela')
  for (let i = 0; i < todos.length; i++) {
    todos[i].style.display = 'none'
  }

  O(m).style.display = 'block'
}

function mostra_tela_match(m, info) {
  const todos = document.getElementsByClassName('tela')
  for (let i = 0; i < todos.length; i++) {
    todos[i].style.display = 'none'
  }
  O(m).style.display = 'block'
  const messageDiv = document.getElementById("tela-mostra-match")

  for (var i = 0; i < info.length; i++) {
    console.log("info no html" + Object.values(info[i]))
  }
  for (var i = 0; i < info.length; i++) {
    console.log("info: " + info[i])
    messageDiv.innerHTML += `
                        <h1>Match</h1>
												<p id="nome">Nome: ${info[i].nome}</p>
												<p id="cidade">Cidade: ${info[i].cidade}</p>
												<p id="contato">Contato: ${info[i].telefone}</p>
												<p id="figurinhas-troca">Figurinhas que quero trocar: ${info[i].figurinha_rep}</p>
												<p id="figurinhas-pessoa-quer">Figurinhas que preciso: ${info[i].figurinha_preciso}</p>                     
												`
  }

  let btn = document.createElement("button");
  btn.innerHTML = "Voltar";

  btn.addEventListener('click', function () {
    mostra('tela-mostra-menu')
    document.getElementById('tela-mostra-match').innerHTML = '';
  })
  messageDiv.appendChild(btn);

}
