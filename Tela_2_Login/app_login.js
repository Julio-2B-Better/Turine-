// =========================================================================
// BRIDGE PATTERN: Consulta Filtrada na tabela 'usuario'
// =========================================================================
class SupabaseLoginImplementor {
    constructor() {
        this.connection = DatabaseConnection.getInstance();
    }

    async verificarCredenciais(email, senha) {
        // Filtros nativos do Supabase Postgres via QueryParams (?email=eq.&senha=eq.)
        const urlFiltro = `${this.connection.url}/usuario?email=eq.${encodeURIComponent(email)}&senha=eq.${encodeURIComponent(senha)}&select=*`;
        
        const response = await fetch(urlFiltro, {
            method: 'GET',
            headers: this.connection.getHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro na comunicação com o servidor de autenticação.");
        }

        return await response.json(); // Retorna uma lista com os registros encontrados
    }
}

class LoginService extends TuriNEObserver {
    constructor(bridge) {
        super();
        this.bridge = bridge;
    }

    async executarLogin(email, senha) {
        const registros = await this.bridge.verificarCredenciais(email, senha);
        this.notify(registros); // Notifica a interface com o resultado da busca
    }
}

// =========================================================================
// INICIALIZAÇÃO DA INTERFACE (UI)
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("meuFormLogin") || document.querySelector("form");
    if (!form) return;

    const implementor = new SupabaseLoginImplementor();
    const service = new LoginService(implementor);

    // Resposta reativa ao fluxo do Observer
    service.subscribe((usuariosEncontrados) => {
        if (usuariosEncontrados.length > 0) {
            const usuario = usuariosEncontrados[0];
            alert(`👋 Bem-vindo de volta, ${usuario.nome}!`);
            
            // Guarda o ID na sessão local para usar nas próximas telas (como Chave Estrangeira)
            localStorage.setItem("id_usuario_logado", usuario.id_usuario);
            
            window.location.href = "../Tela_1_Home/pagina_inicial.html?status=logado";
        } else {
            alert("❌ E-mail ou senha incorretos.");
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector("input[type='email']");
        const senhaInput = form.querySelector("input[type='password']");

        if (!emailInput || !senhaInput) return;

        try {
            await service.executarLogin(emailInput.value, senhaInput.value);
        } catch (err) {
            alert(`❌ Erro no login: ${err.message}`);
        }
    });
});