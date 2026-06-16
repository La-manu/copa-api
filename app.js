const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzE1NjJkNWE5YjM0NGQyYmFlY2IzYyIsImlhdCI6MTc4MTYxODIzMCwiZXhwIjoxNzg4ODc1ODMwfQ.-LDOMmbKo_EJm4KhSiLOQiAu9qzK3-CKelWVRslrlsU"; 
const BASE_URL = "https://worldcup26.ir/get";

// Dicionário de bandeiras completo e revisado para o seu TIMES_BACKUP
const BANDEIRAS_PAISES = {
  "Argentina": "ar", "Brazil": "br", "France": "fr", "Germany": "de", 
  "Italy": "it", "Spain": "es", "England": "gb-eng", "Portugal": "pt",
  "Mexico": "mx", "United States": "us", "Canada": "ca", "Japan": "jp",
  "South Korea": "kr", "Morocco": "ma", "Croatia": "hr", "Netherlands": "nl",
  "Uruguay": "uy", "Colombia": "co", "Senegal": "sn", "Belgium": "be",
  "Switzerland": "ch", "Denmark": "dk", "Tunisia": "tn", "Saudi Arabia": "sa",
  "Iran": "ir", "Australia": "au", "Ecuador": "ec", "Poland": "pl",
  "Ghana": "gh", "Cameroon": "cm", "Serbia": "rs", "Wales": "gb-wls",
  "Costa Rica": "cr", "Ukraine": "ua", "Peru": "pe", "Chile": "cl",
  "Nigeria": "ng", "Algeria": "dz", "Egypt": "eg", "South Africa": "za",
  "Panama": "pa", "Venezuela": "ve", "Paraguay": "py", "Austria": "at", 
  "Romania": "ro", "Slovakia": "sk", "Hungary": "hu", "Scotland": "gb-sct", 
  "Albania": "al", "Slovenia": "si", "Turkey": "tr", "Georgia": "ge", 
  "Czech Republic": "cz"
};

// 💾 DADOS DE BACKUP (Se a API cair ou der TIME OUT, a tela usa esses dados para não quebrar o seu layout!)
const JOGOS_BACKUP = [
  { home_team_name: "United States", away_team_name: "Mexico", group: "A", stadium_id: 1 },
  { home_team_name: "Argentina", away_team_name: "Chile", group: "B", stadium_id: 2 },
  { home_team_name: "Brazil", away_team_name: "Uruguay", group: "C", stadium_id: 3 },
  { home_team_name: "France", away_team_name: "Netherlands", group: "D", stadium_id: 4 },
  { home_team_name: "Belgium", away_team_name: "Ukraine", group: "E", stadium_id: 5 },
  { home_team_name: "Germany", away_team_name: "Switzerland", group: "F", stadium_id: 6 },
  { home_team_name: "Spain", away_team_name: "Italy", group: "G", stadium_id: 7 },
  { home_team_name: "England", away_team_name: "Denmark", group: "H", stadium_id: 8 },
  { home_team_name: "Portugal", away_team_name: "Turkey", group: "I", stadium_id: 9 },
  { home_team_name: "Japan", away_team_name: "Australia", group: "J", stadium_id: 10 },
  { home_team_name: "Morocco", away_team_name: "Senegal", group: "K", stadium_id: 11 },
  { home_team_name: "South Korea", away_team_name: "Ghana", group: "L", stadium_id: 12 }
];

const TIMES_BACKUP = [
  { name_en: "United States", groups: "A" }, { name_en: "Mexico", groups: "A" }, { name_en: "Canada", groups: "A" }, { name_en: "Panama", groups: "A" },
  { name_en: "Argentina", groups: "B" }, { name_en: "Ecuador", groups: "B" }, { name_en: "Chile", groups: "B" }, { name_en: "Venezuela", groups: "B" },
  { name_en: "Brazil", groups: "C" }, { name_en: "Colombia", groups: "C" }, { name_en: "Uruguay", groups: "C" }, { name_en: "Paraguay", groups: "C" },
  { name_en: "France", groups: "D" }, { name_en: "Netherlands", groups: "D" }, { name_en: "Poland", groups: "D" }, { name_en: "Austria", groups: "D" },
  { name_en: "Belgium", groups: "E" }, { name_en: "Romania", groups: "E" }, { name_en: "Slovakia", groups: "E" }, { name_en: "Ukraine", groups: "E" },
  { name_en: "Germany", groups: "F" }, { name_en: "Hungary", groups: "F" }, { name_en: "Switzerland", groups: "F" }, { name_en: "Scotland", groups: "F" },
  { name_en: "Spain", groups: "G" }, { name_en: "Italy", groups: "G" }, { name_en: "Croatia", groups: "G" }, { name_en: "Albania", groups: "G" },
  { name_en: "England", groups: "H" }, { name_en: "Denmark", groups: "H" }, { name_en: "Slovenia", groups: "H" }, { name_en: "Serbia", groups: "H" },
  { name_en: "Portugal", groups: "I" }, { name_en: "Turkey", groups: "I" }, { name_en: "Georgia", groups: "I" }, { name_en: "Czech Republic", groups: "I" },
  { name_en: "Japan", groups: "J" }, { name_en: "Australia", groups: "J" }, { name_en: "Saudi Arabia", groups: "J" }, { name_en: "Iran", groups: "J" },
  { name_en: "Morocco", groups: "K" }, { name_en: "Senegal", groups: "K" }, { name_en: "Tunisia", groups: "K" }, { name_en: "Egypt", groups: "K" },
  { name_en: "South Korea", groups: "L" }, { name_en: "Ghana", groups: "L" }, { name_en: "Cameroon", groups: "L" }, { name_en: "Nigeria", groups: "L" }
];

// Controller principal
async function iniciarDashboard() {
  const statusContainer = document.getElementById("status");
  const jogosContainer = document.getElementById("jogos");
  const listaTimes = document.getElementById("lista-times");

  // ⭐ CORREÇÃO AQUI: Força o texto de loading a aparecer IMEDIATAMENTE na tela
  // antes de qualquer requisição demorada começar
  if (listaTimes) {
    listaTimes.innerHTML = `<li style="grid-column: 1 / -1; text-align: center; color: #aaa; background: none; border: none; padding: 20px;">⚽ Carregando seleções do mundial...</li>`;
  }
  if (jogosContainer) {
    jogosContainer.innerHTML = `<p style="color: #aaa; text-align: center; width: 100%; padding: 40px;">🔥 Sincronizando confrontos em destaque...</p>`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 segundos de limite para resposta da API

    const [resTimes, resJogos] = await Promise.all([
      fetch(`${BASE_URL}/teams`, { headers: { Authorization: `Bearer ${TOKEN}` }, signal: controller.signal }),
      fetch(`${BASE_URL}/games`, { headers: { Authorization: `Bearer ${TOKEN}` }, signal: controller.signal })
    ]);

    clearTimeout(timeoutId);

    if (!resTimes.ok || !resJogos.ok) throw new Error("Erro nas rotas de produção.");

    const dadosTimesRaw = await resTimes.json();
    const dadosJogosRaw = await resJogos.json();

    const listagemTimes = Array.isArray(dadosTimesRaw) ? dadosTimesRaw : (dadosTimesRaw.teams || []);
    const listagemJogos = Array.isArray(dadosJogosRaw) ? dadosJogosRaw : (dadosJogosRaw.games || []);

    // Se a API responder rápido, limpa as mensagens de loading e coloca os dados reais
    if (statusContainer) statusContainer.innerHTML = "";
    renderizarSelecoes(listagemTimes);
    renderizarJogosEmDestaque(listagemJogos);

  } catch (erro) {
    console.warn("API offline ou lento. Carregando modo de contingência local.", erro);
    
    // Alerta visual de contingência
    if (statusContainer) {
      statusContainer.innerHTML = `
        <div style="color: #ffca05; background: rgba(255, 202, 5, 0.1); padding: 10px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 20px; text-align: center; border: 1px solid rgba(255, 202, 5, 0.2); width: 100%;">
          ⚠️ Servidor instável. Exibindo dados simulados offline com bandeiras oficiais.
        </div>
      `;
    }

    // Limpa os placeholders de loading para renderizar os dados estáveis de backup
    if (listaTimes) listaTimes.innerHTML = "";
    if (jogosContainer) jogosContainer.innerHTML = "";

    renderizarSelecoes(TIMES_BACKUP);
    renderizarJogosEmDestaque(JOGOS_BACKUP);
  }
}

// ==========================================================================
// BARRA DE FILTROS POR GRUPO (Injetada via JS acima da lista)
// ==========================================================================
function renderizarFiltros(times) {
  const listaTimes = document.getElementById("lista-times");
  if (!listaTimes || document.getElementById("container-filtros")) return;

  const containerFiltros = document.createElement("div");
  containerFiltros.id = "container-filtros";
  containerFiltros.style.display = "flex";
  containerFiltros.style.flexWrap = "wrap";
  containerFiltros.style.gap = "6px";
  containerFiltros.style.marginBottom = "16px";
  containerFiltros.style.width = "100%";

  const grupos = ["Todos", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  grupos.forEach((grupo) => {
    const botao = document.createElement("button");
    botao.textContent = grupo;
    botao.className = "btn-filtro";
    
    // Mantém a estilização escura idêntica à do seu projeto
    botao.style.background = grupo === "Todos" ? "#006643" : "rgba(255, 255, 255, 0.05)";
    botao.style.color = "#fff";
    botao.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    botao.style.padding = "6px 12px";
    botao.style.borderRadius = "4px";
    botao.style.cursor = "pointer";
    botao.style.fontWeight = "700";
    botao.style.fontSize = "0.8rem";
    botao.style.transition = "all 0.2s ease";

    botao.addEventListener("click", () => {
      // Reseta visualmente todos os botões e destaca o ativo
      document.querySelectorAll(".btn-filtro").forEach(btn => btn.style.background = "rgba(255, 255, 255, 0.05)");
      botao.style.background = "#006643";

      if (grupo === "Todos") {
        montarListaDOM(times);
      } else {
        // 🔥 CORREÇÃO DA CONDICIONAL: Valida estritamente contra a variável local 'grupo'
        const filtrados = times.filter(t => {
          const grupoDoTime = t.groups || t.group;
          return grupoDoTime === grupo;
        });
        montarListaDOM(filtrados);
      }
    });

    containerFiltros.appendChild(botao);
  });

  listaTimes.parentNode.insertBefore(containerFiltros, listaTimes);
}

// ==========================================================================
// RENDERIZAÇÃO DE SELEÇÕES CLASSIFICADAS
// ==========================================================================
function renderizarSelecoes(times) {
  renderizarFiltros(times);
  montarListaDOM(times);
}

function montarListaDOM(listaTimesExibir) {
  const listaTimes = document.getElementById("lista-times");
  if (!listaTimes) return;
  listaTimes.innerHTML = "";

  listaTimesExibir.forEach((time) => {
    const itemLi = document.createElement("li");
    
    const nomePais = time.name_en || "Seleção";
    const siglaBandeira = BANDEIRAS_PAISES[nomePais] || "un";
    const grupoLetra = time.groups || time.group || "-";

    itemLi.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; font-weight: 600; color: #fff;">
        <img src="https://flagcdn.com/20x15/${siglaBandeira}.png" alt="${nomePais}" style="border-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.4);">
        <span>${nomePais}</span>
      </div>
      <span class="group-badge" style="background: rgba(255, 255, 255, 0.1); color: #ffca05; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.05);">
        Grupo ${grupoLetra}
      </span>
    `;
    
    itemLi.style.display = "flex";
    itemLi.style.justifyContent = "space-between";
    itemLi.style.alignItems = "center";
    itemLi.style.padding = "12px 16px";

    listaTimes.appendChild(itemLi);
  });
}

// ==========================================================================
// RENDERIZAÇÃO DE JOGOS EM DESTAQUE
// ==========================================================================
function renderizarJogosEmDestaque(jogos) {
  const jogosContainer = document.getElementById("jogos");
  if (!jogosContainer) return;
  jogosContainer.innerHTML = "";

  const proximasPartidas = jogos.slice(0, 12);

  proximasPartidas.forEach((jogo) => {
    const cardJogo = document.createElement("div");
    cardJogo.className = "card-partida";

    const nomeCasa = jogo.home_team_name || "A definir";
    const nomeFora = jogo.away_team_name || "A definir";

    const siglaCasa = BANDEIRAS_PAISES[nomeCasa] || "un";
    const siglaFora = BANDEIRAS_PAISES[nomeFora] || "un";

    const imgBandeiraCasa = `<img src="https://flagcdn.com/24x18/${siglaCasa}.png" alt="${nomeCasa}" style="border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,0.4);">`;
    const imgBandeiraFora = `<img src="https://flagcdn.com/24x18/${siglaFora}.png" alt="${nomeFora}" style="border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,0.4);">`;

    cardJogo.innerHTML = `
      <div class="match-group" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #a0a0a0; margin-bottom: 12px; letter-spacing: 0.5px;">
        Grupo ${jogo.group || "-"}
      </div>
      <div class="match-flex" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 10px;">
        <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 8px; font-weight: 600; color: #fff; font-size: 1.1rem;">
          <span>${nomeCasa}</span>
          ${imgBandeiraCasa}
        </div>
        <span class="match-vs" style="background: #006643; color: white; padding: 3px 9px; border-radius: 4px; font-size: 0.75rem; font-weight: 800;">X</span>
        <div style="flex: 1; display: flex; align-items: center; justify-content: flex-start; gap: 8px; font-weight: 600; color: #fff; font-size: 1.1rem;">
          ${imgBandeiraFora}
          <span>${nomeFora}</span>
        </div>
      </div>
      <div class="match-info" style="margin-top: 14px; font-size: 0.8rem; color: #888;">
        Estádio ID: ${jogo.stadium_id || "Sede a confirmar"}
      </div>
    `;
    jogosContainer.appendChild(cardJogo);
  });
}

iniciarDashboard();