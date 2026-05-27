// =========================================================================
// BRIDGE PATTERN: Desacopla o front-end (Abstração) do banco Supabase (Implementação)
// =========================================================================
class SupabaseCadastroImplementor {
    constructor() {
        // Uso do SINGLETON herdado do seu arquivo global database.js
        this.connection = DatabaseConnection.getInstance(); 
    }

    async inserirNoBanco(dadosUsuario) {
        // Aponta para a tabela 'usuario' em minúsculo
        const response = await fetch(`${this.connection.url}/usuario`, {
            method: 'POST',
            headers: {
                ...this.connection.getHeaders(),
                "Prefer": "return=representation"
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (!response.ok) {
            const erroDetalhado = await response.json();
            throw new Error(erroDetalhado.message || "Falha na comunicação com o Supabase.");
        }

        return await response.json();
    }
}

// O seu Service agora EXTENDE o seu TuriNEObserver real do patterns.js
class CadastroService extends TuriNEObserver {
    constructor(bridge) {
        super(); // Inicializa o array this.subscribers do seu patterns.js
        this.bridge = bridge;
    }

    async executarCadastro(dadosUsuario) {
        // 1. Realiza a persistência no banco usando a ponte da Bridge
        const resultado = await this.bridge.inserirNoBanco(dadosUsuario);
        
        // 2. Dispara o seu método notify(dados) real do patterns.js
        this.notify(resultado);
    }
}

// =========================================================================
// INICIALIZAÇÃO DA INTERFACE (UI)
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("meuFormCadastro");
    if (!form) return;

    // Instancia os componentes
    const implementor = new SupabaseCadastroImplementor();
    const service = new CadastroService(implementor);
    
    // Inscrição no seu Observer usando o padrão de CALLBACK que você programou!
    service.subscribe((dadosRetornados) => {
        form.reset(); // Limpa a tela
        alert(`🎉 Usuário cadastrado com sucesso direto no banco!`);
        window.location.href = "../Tela_2_Login/login.html"; // Redireciona
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Captura robusta pelos seletores de tipo e posição
        const nomeInput = document.getElementById("regNome") || form.querySelector("input[placeholder*='Nome']");
        const emailInput = document.getElementById("regEmail") || form.querySelector("input[type='email']");
        const senhaInput = document.getElementById("regSenha") || form.querySelector("input[type='password']");

        if (!nomeInput || !emailInput || !senhaInput) {
            alert("❌ Erro interno: Campos do formulário não localizados.");
            return;
        }

        const nomeValue = nomeInput.value;
        const emailValue = emailInput.value;
        const senhaValue = senhaInput.value;

        // Validação básica local (substituindo o antigo visitor temporariamente para o cadastro de usuário)
        if (nomeValue.trim().length < 3) {
            alert("❌ O nome precisa ter pelo menos 3 caracteres.");
            return;
        }

        // Montagem do objeto usando as colunas em minúsculo do banco
        const novoUsuario = {
            nome: nomeValue,
            email: emailValue,
            senha: senhaValue,
            u_tipo: "turista"
        };

        try {
            await service.executarCadastro(novoUsuario);
        } catch (err) {
            alert(`❌ Falha no cadastro: ${err.message}`);
        }
    });
});