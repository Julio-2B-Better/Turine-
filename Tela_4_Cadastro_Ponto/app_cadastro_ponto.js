class PostgresPontoImplementor {
    constructor() { this.connection = DatabaseConnection.getInstance(); }
    async chamarProcedurePonto(parametros) {
        const response = await fetch(`${this.connection.url}/rpc/inserir_ponto`, {
            method: 'POST', headers: this.connection.getHeaders(), body: JSON.stringify(parametros)
        });
        if (!response.ok) throw new Error("Falha na validação do Ponto Turístico.");
        return true;
    }
}

class CadastroPontoService {
    constructor(bridge) { this.bridge = bridge; }
    async registrarPonto(id, nome, descricao, localizacao, dataHora, tTipo, idGestor) {
        const payload = {
            P_ID_PONTO: parseInt(id),
            P_NOME: nome,
            P_DESCRICAO: descricao,
            P_LOC: localizacao,
            P_DATA: dataHora,
            P_T_TIPO: tTipo,
            P_ID_GESTOR: parseInt(idGestor)
        };
        return await this.bridge.chamarProcedurePonto(payload);
    }
}

const pontoService = new CadastroPontoService(new PostgresPontoImplementor());

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-cadastro-ponto");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = Math.floor(Math.random() * 10000);
        const nome = document.getElementById("ponto-nome").value;
        const descricao = document.getElementById("ponto-desc").value;
        const localizacao = document.getElementById("ponto-loc").value;
        const dataHora = new Date().toISOString();
        const tTipo = document.getElementById("ponto-tipo").value;
        const idGestor = document.getElementById("ponto-gestor-id").value;

        try {
            await pontoService.registrarPonto(id, nome, descricao, localizacao, dataHora, tTipo, idGestor);
            alert("✅ Ponto Turístico gravado com sucesso no PostgreSQL via Procedure!");
            form.reset();
        } catch (err) { alert("Erro de Restrição do Banco: " + err.message); }
    });
});