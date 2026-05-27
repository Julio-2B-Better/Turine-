class SupabaseCronogramaImplementor {
    constructor() {
        this.connection = DatabaseConnection.getInstance();
    }

    async inserirNoBanco(dadosAgendamento) {
        const response = await fetch(`${this.connection.url}/agendamento`, {
            method: 'POST',
            headers: {
                ...this.connection.getHeaders(),
                "Prefer": "return=representation"
            },
            body: JSON.stringify(dadosAgendamento)
        });

        if (!response.ok) {
            const erroDetalhado = await response.json();
            throw new Error(erroDetalhado.message || "Falha ao registrar agendamento.");
        }
        return await response.json();
    }
}

class CronogramaService extends TuriNEObserver {
    constructor(bridge) {
        super();
        this.bridge = bridge;
    }

    async executarAgendamento(dadosAgendamento) {
        const resultado = await this.bridge.inserirNoBanco(dadosAgendamento);
        this.notify(resultado);
    }
}

// =========================================================================
// INICIALIZAÇÃO DA INTERFACE (UI)
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("meuFormCronograma") || document.querySelector("form");
    if (!form) return;

    const implementor = new SupabaseCronogramaImplementor();
    const service = new CronogramaService(implementor);

    service.subscribe(() => {
        form.reset();
        alert("✈️ Cronograma criado e agendado com sucesso no banco de dados!");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dataVisitaInput = form.querySelector("input[type='date']");
        const idPontoInput = form.querySelector("select, input[placeholder*='Ponto']"); // Adapte ao seu campo

        const idTuristaLogado = localStorage.getItem("id_usuario_logado") || 1;

        const novoAgendamento = {
            id_agendamento: Math.floor(Math.random() * 900000) + 100000,
            id_turista: parseInt(idTuristaLogado),
            id_ponto: idPontoInput ? parseInt(idPontoInput.value) : 1, // Chave estrangeira para tabela ponto_turistico
            data_visita: dataVisitaInput ? dataVisitaInput.value : new Date().toISOString().split('T')[0]
        };

        try {
            await service.executarAgendamento(novoAgendamento);
        } catch (err) {
            alert(`❌ Falha ao agendar: ${err.message}`);
        }
    });
});