class PostgresCronogramaImplementor {
    constructor() { this.connection = DatabaseConnection.getInstance(); }
    async chamarProcedureAgendamento(parametros) {
        const response = await fetch(`${this.connection.url}/rpc/inserir_agendamento`, {
            method: 'POST', headers: this.connection.getHeaders(), body: JSON.stringify(parametros)
        });
        if (!response.ok) throw new Error("Erro ao salvar agendamento de cronograma.");
        return true;
    }
}

// BRIDGE ABSTRAÇÃO
class CronogramaService {
    constructor(bridge) { this.bridge = bridge; }
    async agendarVisita(idAgendamento, idTurista, idPonto, dataVisita) {
        const payload = {
            P_ID_AGENDAMENTO: parseInt(idAgendamento),
            P_ID_TURISTA: parseInt(idTurista),
            P_ID_PONTO: parseInt(idPonto),
            P_DATA: dataVisita
        };
        return await this.bridge.chamarProcedureAgendamento(payload);
    }
}

const cronogramaService = new CronogramaService(new PostgresCronogramaImplementor());

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-cronograma");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const idAgendamento = Math.floor(Math.random() * 10000);
        const idTurista = document.getElementById("turista-id").value;
        const idPonto = document.getElementById("ponto-selecionado-id").value;
        const dataVisita = document.getElementById("data-agendada").value;

        try {
            await cronogramaService.agendarVisita(idAgendamento, idTurista, idPonto, dataVisita);
            alert("✅ Cronograma de viagem agendado e salvo com sucesso!");
            form.reset();
        } catch (err) { alert(err.message); }
    });
});