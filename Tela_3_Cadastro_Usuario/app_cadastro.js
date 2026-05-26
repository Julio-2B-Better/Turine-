class PostgresCadastroImplementor {
    constructor() { this.connection = DatabaseConnection.getInstance(); }
    async chamarProcedureCadastro(parametros) {
        const response = await fetch(`${this.connection.url}/rpc/inserir_usuario`, {
            method: 'POST',
            headers: this.connection.getHeaders(),
            body: JSON.stringify(parametros)
        });
        if (!response.ok) throw new Error("Erro crítico ao executar procedure de cadastro.");
        return true;
    }
}

class CadastroUsuarioService {
    constructor(bridge) { this.bridge = bridge; }
    async cadastrar(id, nome, email, senha, tipo) {
        const payload = {
            P_ID_USUARIO: parseInt(id),
            P_NOME: nome,
            P_EMAIL: email,
            P_SENHA: senha,
            P_U_TIPO: tipo
        };
        return await this.bridge.chamarProcedureCadastro(payload);
    }
}

const cadastroService = new CadastroUsuarioService(new PostgresCadastroImplementor());

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = Math.floor(Math.random() * 10000);
        const nome = form.querySelector("#nome").value;
        const email = form.querySelector("#email").value;
        const senha = form.querySelector("#senha").value;
        const tipo = form.querySelector("#tipo_usuario").value;

        try {
            await cadastroService.cadastrar(id, nome, email, senha, tipo);
            window.location.href = "../Tela_1_Home/pagina_inicial.html?status=contaCriada";
        } catch (err) { alert(err.message); }
    });
});