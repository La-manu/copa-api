const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzE1NjJkNWE5YjM0NGQyYmFlY2IzYyIsImlhdCI6MTc4MTYxODIzMCwiZXhwIjoxNzg4ODc1ODMwfQ.-LDOMmbKo_EJm4KhSiLOQiAu9qzK3-CKelWVRslrlsU"; 
const BASE_URL = "https://worldcup26.ir/get";

// 1. FUNÇÃO PRINCIPAL: Controla o fluxo de carregamento da página
async function iniciarDashboard() {
  const status = document.getElementById("status");
  const jogosContainer = document.getElementById("jogos");

  // Feedback de carregamento (Spinner)
  status.innerHTML = `
    <div class="loading-spinner"></div>
    <p style="color: var(--text-muted); margin-top: 0.5rem; font-size: 0.9rem;">Buscando dados da Copa 2026...</p>
  `;
  jogosContainer.innerHTML = `<p style="color: #666; text-align: center; width: 100%;">Carregando confrontos...</p>`;

  try {
    // Busca os dados simultaneamente nas duas rotas da API
    const [resTimes, resJogos] = await Promise.all([
      fetch(`${BASE_URL}/teams`, { headers: { Authorization: `Bearer ${TOKEN}` } }),
      fetch(`${BASE_URL}/games`, { headers: { Authorization: `Bearer ${TOKEN}` } })
    ]);

    if (!resTimes.ok || !resJogos.ok) throw new Error("Erro na comunicação com o servidor.");

    const dadosTimesRaw = await resTimes.json();
    const dadosJogosRaw = await resJogos.json();

    // Filtra e valida se os dados retornaram como array
    const listagemTimes = Array.isArray(dadosTimesRaw) ? dadosTimesRaw : (dadosTimesRaw.teams || dadosTimesRaw.data || []);
    const listagemJogos = Array.isArray(dadosJogosRaw) ? dadosJogosRaw : (dadosJogosRaw.games || dadosJogosRaw.data || []);

    // Limpa os estados de carregamento
    status.innerHTML = "";
    jogosContainer.innerHTML = "";

    // Renderiza cada seção no seu respectivo elemento HTML
    renderizarSelecoes(listagemTimes);
    renderizarJogosEmDestaque(listagemJogos);

  } catch (erro) {
    console.error(erro);
    status.innerHTML = `
      <div class="error-msg">
        ⚠️ Não foi possível carregar o painel.<br>
        <small style="font-size: 0.8rem; opacity: 0.8;">${erro.message}</small>
      </div>
    `;
    jogosContainer.innerHTML = `<p style="color: #ff3333; text-align: center; width: 100%;">Falha ao carregar as partidas.</p>`;
  }
}

// 2. SEÇÃO DE SELEÇÕES: Alimenta a sua <ul id="lista-times">
function renderizarSelecoes(times) {
  const listaTimes = document.getElementById("lista-times");
  listaTimes.innerHTML = "";

  times.forEach((time) => {
    const itemLi = document.createElement("li");
    itemLi.innerHTML = `
      <span class="country-name">${time.name_en}</span>
      <span class="group-badge">Grupo ${time.groups}</span>
    `;
    listaTimes.appendChild(itemLi);
  });
}

// 3. SEÇÃO DE JOGOS: Alimenta a sua <div id="jogos" class="grid">
// Resolve de vez o problema do "A definir" e da duplicação
function renderizarJogosEmDestaque(jogos) {
  const jogosContainer = document.getElementById("jogos");
  jogosContainer.innerHTML = "";

  // Exibe apenas as 6 primeiras partidas da tabela para manter o visual limpo
  const proximasPartidas = jogos.slice(0, 6);

  proximasPartidas.forEach((jogo) => {
    const cardJogo = document.createElement("div");
    cardJogo.className = "card-partida"; // Sua classe de estilo para os confrontos

    // Mapeamento inteligente para evitar "A definir" baseado na resposta real da API
    const timeCasa = jogo.home_team_name || (jogo.team_home && jogo.team_home.name_en) || `Time #${jogo.home_id || 'A'}`;
    const timeFora = jogo.away_team_name || (jogo.team_away && jogo.team_away.name_en) || `Time #${jogo.away_id || 'B'}`;
    const grupo = jogo.group || (jogo.team_home && jogo.team_home.groups) || "-";
    const estadioInfo = jogo.stadium_id ? `Estádio ID: ${jogo.stadium_id}` : "Estádio a definir";

    cardJogo.innerHTML = `
      <div class="match-group">Grupo ${grupo}</div>
      <div class="match-flex">
        <span class="team-home">${timeCasa}</span>
        <span class="match-vs">X</span>
        <span class="team-away">${timeFora}</span>
      </div>
      <div class="match-info">${estadioInfo}</div>
    `;

    jogosContainer.appendChild(cardJogo);
  });
}

// Inicializa a aplicação disparando o fluxo completo
iniciarDashboard();