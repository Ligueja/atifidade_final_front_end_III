const cartoes_personagens = document.getElementById("cartoes");
const paginacao = document.getElementById("paginacao");

let pagina = 1;

const instance = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});


//função para carregar os personagens dentro dos cards que também estarão sendo criados. 
async function carregarPersonagens(personagens) {
  const fragmento = document.createDocumentFragment();

  // Limitar a exibição a 6 personagens por página, como consta no exemplo enviado na atividade
  const personagensExibidos = personagens.slice(0, 6);

  personagensExibidos.forEach((personagem, index) => {
    const cartao = document.createElement("div");
    cartao.classList.add("card", "m-4", "col-12", "col-md-6", "col-lg-4", "cartao"); 
    cartao.style.width = "18rem"; 

    const imagem = document.createElement("img");
    imagem.classList.add("card-img-top");
    imagem.src = personagem.image;
    imagem.alt = "Imagem de capa do card";

    const corpoCartao = document.createElement("div");
    corpoCartao.classList.add("card-body", "text-white", "corpo_cartao");

    const nome = document.createElement("h5");
    nome.classList.add("card-title", "titulo_cartao");
    nome.textContent = personagem.name;
  
    const descricao = document.createElement("p");
    descricao.classList.add("card-text", "texto_cartao");
    descricao.innerHTML = `${statusPersonagens(personagem.status)} &nbsp; &nbsp; Status: ${traduzirStatus(personagem.status)}, &nbsp; Espécie: ${personagem.species}`;
    

    const localizacao = document.createElement("p");
    localizacao.classList.add("localizacao", "localizacao_personagem");
    localizacao.textContent = personagem.location.name;

    const linkVisitar = document.createElement("a");
    linkVisitar.href = "#";
    linkVisitar.classList.add("btn", "btn-sm", "botao_cartao");
    linkVisitar.textContent = "Detalhes";

    linkVisitar.addEventListener("click", () => abrirModalDetalhes(personagem));

    corpoCartao.appendChild(nome);
    corpoCartao.appendChild(descricao);
    corpoCartao.appendChild(localizacao);
    corpoCartao.appendChild(linkVisitar);

    cartao.appendChild(imagem);
    cartao.appendChild(corpoCartao);

    fragmento.appendChild(cartao);
  });

  // Limpar os cartões antigos antes de adicionar os novos
  cartoes_personagens.innerHTML = "";

  // Adicionar os novos cartões ao cartoes_personagens
  cartoes_personagens.appendChild(fragmento);
}


// função para traduzir o status dos personagens
function traduzirStatus(status) {
  
  if (status === "Alive") {
    return "Vivo";
  } 
  else if (status === "Dead") {
    return "Morto";
  }
  else {
    return "Desconhecido";
  }
}

//função para verificar qual o status do personagem e inserir ao mesmo a bolinha da cor correspondente (vivo - verde, morto - vermelho, desconhecido - cinza.)
function statusPersonagens(status) {
 
  if (status === "Alive") {
    return '<span class="color_status_vivo"></span>'; 
  }
  else if (status === "Dead") {
    return '<span class="color_status_morto"></span>'
  }
  else {
    return '<span class="color_status_desconhecido"></span>';
  }
} 

//função para fazer a paginação dos personagens com a rota GET. 
async function paginacaoPersonagens(pagina) {
  if (pagina < 1) {
    return;
  }

  try {
    const url = `/character?page=${pagina}`;
    const resposta = await instance.get(url);

    if (resposta.data && resposta.data.results) {
      const personagens = resposta.data.results;

      cartoes_personagens.innerHTML = "";

      carregarPersonagens(personagens);
    } else {
      console.error("Resposta da API inválida:", resposta);
    }
  } catch (erro) {
    console.error("Erro ao obter personagens:", erro);
  }
}

// função para voltar para pagina anterior, que será inserida no botão "Anterior"
function voltar() {
  pagina--;
  paginacaoPersonagens(pagina);
  rolarTelaTopo();
}

// função para avançar para próxima pagina, que se´ra inserida no botão "Próximo"
function proximo() {
  pagina++;
  paginacaoPersonagens(pagina);
  rolarTelaTopo();
}

//função para criar e estilizar os botões "Anterior" e "Próximo"
function criarMenuPaginacao() {
  const botaoAnterior = document.createElement("button");
  botaoAnterior.setAttribute("type", "button");
  botaoAnterior.classList.add("btn", "btn-secondary", "btn-sm", "me-2", "botao_anterior");
  botaoAnterior.innerHTML = "Anterior";
  botaoAnterior.addEventListener("click", voltar);

  const botaoProximo = document.createElement("button");
  botaoProximo.setAttribute("type", "button");
  botaoProximo.classList.add("btn", "btn-secondary", "btn-sm", "botao_proximo");
  botaoProximo.innerHTML = "Próximo";
  botaoProximo.addEventListener("click", proximo);

  const divBotoes = document.createElement("div");
  divBotoes.classList.add("d-flex", "justify-content-center");
  divBotoes.appendChild(botaoAnterior);
  divBotoes.appendChild(botaoProximo);

  paginacao.appendChild(divBotoes);
}

// função padrão para o rolar a pagina até o topo quando solicitado. No caso dessa aplicação, quando é presionado os botões de paginação. 
function rolarTelaTopo() {

  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  })
}

paginacaoPersonagens(pagina);

criarMenuPaginacao();


// função para chamar atrávés da rota GET as informações da API Rick and Morty no rodapé da tela.
async function dadosFooter() {
  const resposta1 = await instance.get("/character");

  const personagens = resposta1.data.info.count;
  console.log("Total de personagens: " + personagens);

 document.getElementById(
    "qtdPersonagens"
  ).innerHTML = `PERSONAGENS: ${personagens}`;

  const resposta2 = await instance.get("/location");

  const localizao = resposta2.data.info.count;
  console.log("Total de localizações: " + localizao);

  document.getElementById(
    "qtdLocalizacoes"
  ).innerHTML = `LOCALIZAÇÕES: ${localizao}`;

  const resposta3 = await instance.get("/episode");

  const episodio = resposta3.data.info.count;
  console.log("Total de episódios: " + episodio);

  document.getElementById("qtdEpisodios").innerHTML = `EPISÓDIOS: ${episodio}`;
}

// Função para abrir o modal com os detalhes do personagem escolhido
function abrirModalDetalhes(personagem) {
  const modalTitulo = document.querySelector(".modal-title");
  modalTitulo.innerHTML = `<div class="titulo_modal">Detalhes de ${personagem.name}</div>`;

  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = `
    <div style="text-align: center; color: white;">
      <img src="${personagem.image}" alt="${personagem.name}" style="max-width: 100%; height: auto;">
      <p><strong>Nome:</strong> ${personagem.name}</p>
      <p style="color: white;"><strong>Status:</strong> ${traduzirStatus(personagem.status)} &nbsp ${statusPersonagens(personagem.status)}</p>
      <p style="color: white;"><strong>Espécie:</strong> ${personagem.species}</p>
      <p style="color: white;"><strong>Localização:</strong> ${personagem.location.name}</p>
    </div>
  `;

  const modal = new bootstrap.Modal(document.querySelector(".modal"));
  modal.show();
}

dadosFooter();