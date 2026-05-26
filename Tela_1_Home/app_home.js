class PostgresHomeImplementor {
    constructor() { this.connection = DatabaseConnection.getInstance(); }
    async buscarTabela(tabela) {
        const response = await fetch(`${this.connection.url}/${tabela}?select=*`, {
            method: 'GET', headers: this.connection.getHeaders()
        });
        return await response.json();
    }
}

class HomeService {
    constructor(bridge) { this.bridge = bridge; }
    async obterPontosTurine() { return await this.bridge.buscarTabela('PONTO_TURISTICO'); }
}

const homeBridge = new PostgresHomeImplementor();
const serviceHome = new HomeService(homeBridge);
const observerHome = new TuriNEObserver();

observerHome.subscribe((pontos) => {
    const gridDiv = document.getElementById('grid-locais');
    if (!gridDiv) return;
    gridDiv.innerHTML = '';

    pontos.forEach(ponto => {
        gridDiv.innerHTML += `
            <div>
                <p>${ponto.NOME}</p>
                <div class="card" title="${ponto.DESCRICAO}"><div class="pin"></div>clique</div>
            </div>`;
    });

    // Mantém o comportamento nativo do seu script dos PINS funcionais
    document.querySelectorAll('.pin').forEach(pin => {
        pin.addEventListener('click', () => pin.classList.toggle('ativo'));
    });

    const visitor = new EstatisticasVisitor();
    console.log("📊 [VISITOR - HOME]:", visitor.visitPontoTuristico(pontos));
});

window.onload = async () => {
    try {
        const dados = await serviceHome.obterPontosTurine();
        observerHome.notify(dados);
    } catch (err) { console.error("Erro na integração do banco:", err); }
};