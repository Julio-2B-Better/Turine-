class SupabasePontoImplementor {
    constructor() {
        this.connection = DatabaseConnection.getInstance();
    }

    async inserirNoBanco(dadosPonto) {
        const response = await fetch(`${this.connection.url}/ponto_turistico`, {
            method: 'POST',
            headers: {
                ...this.connection.getHeaders(),
                "Prefer": "return=representation"
            },
            body: JSON.stringify(dadosPonto)
        });

        if (!response.ok) {
            const erroDetalhado = await response.json();
            throw new Error(erroDetalhado.message || "Falha ao registrar ponto turístico.");
        }
        return await response.json();
    }
}

class PontoCadastroService extends TuriNEObserver {
    constructor(bridge) {
        super();
        this.bridge = bridge;
    }

    async executarCadastro(dadosPonto) {
        const resultado = await this.bridge.inserirNoBanco(dadosPonto);
        this.notify(resultado);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("meuFormPonto") || document.querySelector("form");
    if (!form) return;

    const implementor = new SupabasePontoImplementor();
    const service = new PontoCadastroService(implementor);

    service.subscribe(() => {
        form.reset();
        alert("✅ Ponto Turístico cadastrado com sucesso no banco de dados!");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Mapeia os inputs conforme as classes/ids do seu formulário físico
        const nome = form.querySelector("input[placeholder*='Nome']")?.value || "";
        const descricao = form.querySelector("textarea")?.value || form.querySelector("input[placeholder*='Descrição']")?.value || "";
        const localizacao = form.querySelector("input[placeholder*='Localizacao']")?.value || "Nordeste";
        const t_tipo = form.querySelector("select")?.value || "Cultura";

        // Recupera o ID do usuário logado ou assume um padrão cadastrado
        const idGestorLogado = localStorage.getItem("id_usuario_logado") || 1;

        const novoPonto = {
            id_ponto: Math.floor(Math.random() * 900000) + 100000, // Gera ID inteiro robusto
            nome: nome,
            descricao: descricao,
            localizacao: localizacao,
            data_hora: new Date().toLocaleDateString('pt-BR'),
            t_tipo: t_tipo,
            id_gestor: parseInt(idGestorLogado)
        };

        try {
            await service.executarCadastro(novoPonto);
        } catch (err) {
            alert(`❌ Falha ao cadastrar ponto: ${err.message}`);
        }
    });
});