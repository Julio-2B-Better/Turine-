class SupabaseHomeImplementor {
    constructor() {
        this.connection = DatabaseConnection.getInstance(); // Singleton
    }

    async buscarDoBanco() {
        const response = await fetch(`${this.connection.url}/ponto_turistico?select=*`, {
            method: 'GET',
            headers: this.connection.getHeaders()
        });

        if (!response.ok) {
            const erroDetalhado = await response.json();
            throw new Error(erroDetalhado.message || "Falha ao buscar pontos turísticos.");
        }
        return await response.json();
    }
}

class HomeService extends TuriNEObserver {
    constructor(bridge) {
        super(); // Inicializa o Observer
        this.bridge = bridge;
    }

    async carregarPontos() {
        const pontos = await this.bridge.buscarDoBanco();
        this.notify(pontos); // Dispara a reatividade do Observer
    }
}