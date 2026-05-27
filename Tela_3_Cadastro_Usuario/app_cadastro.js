// =========================================================================
// OBSERVER PATTERN: Gerencia notificações do sistema após operações de banco
// =========================================================================
//class DatabaseSubject {
//    constructor() { this.observers = []; }
//    subscribe(observer) { this.observers.push(observer); }
//    notify(event, data) { this.observers.forEach(obs => obs.update(event, data)); }
//}

class FormResetObserver {
    constructor(formElement) { this.form = formElement; }
    update(event, data) {
        if (event === "CADASTRO_SUCESSO") {
            this.form.reset();
            alert(`🎉 Usuário ${data[0].NOME} cadastrado com sucesso direto no banco!`);
            window.location.href = "../Tela_2_Login/login.html";
        }
    }
}

// =========================================================================
// VISITOR PATTERN: Visita os dados capturados da UI para validação de regras
// =========================================================================
class UsuarioValidacaoVisitor {
    visit(dados) {
        if (!dados.NOME || dados.NOME.trim().length < 3) throw new Error("O nome precisa ter pelo menos 3 caracteres.");
        if (!dados.EMAIL.includes("@")) throw new Error("Insira um endereço de e-mail válido.");
        if (!dados.SENHA || dados.SENHA.length < 4) throw new Error("A senha deve conter no mínimo 4 dígitos.");
    }
}

// =========================================================================
// BRIDGE PATTERN: Desacopla o front-end (Abstração) do banco Supabase (Implementação)
// =========================================================================
class SupabaseCadastroImplementor {
    constructor() {
        // Uso do SINGLETON herdado do arquivo global database.js
        this.connection = DatabaseConnection.getInstance(); 
    }

    async inserirNoBanco(dadosUsuario) {
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

class CadastroService extends DatabaseSubject {
    constructor(bridge) {
        super();
        this.bridge = bridge; // Ponte estabelecida aqui
    }

    async executarCadastro(dadosUsuario, visitor) {
        // 1. Aplica o processamento/validação do Visitor
        visitor.visit(dadosUsuario);
        
        // 2. Realiza a persistência usando a ponte da Bridge
        const resultado = await this.bridge.inserirNoBanco(dadosUsuario);
        
        // 3. Comunica os Observers interessados no sucesso da operação
        this.notify("CADASTRO_SUCESSO", resultado);
    }
}

// =========================================================================
// INICIALIZAÇÃO DA INTERFACE (UI)
// =========================================================================
document.addEventListener("DOMContentLoaded"), () => {
    const form = document.getElementById("meuFormCadastro");
    if (!form) return;
}

    // Acoplamento das instâncias dos Padrões de Projeto
    const implementor = new SupabaseCadastroImplementor();
    const service = new CadastroService(implementor);
    const validadorVisitor = new UsuarioValidacaoVisitor();
    const limpadorObserver = new FormResetObserver(form);
    
    service.subscribe(limpadorObserver);

form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Iniciando envio...");

        // Captura alternativa e robusta pelos seletores de tipo e posição
        const nomeInput = document.getElementById("regNome") || form.querySelector("input[placeholder*='Nome']");
        const emailInput = document.getElementById("regEmail") || form.querySelector("input[type='email']");
        const senhaInput = document.getElementById("regSenha") || form.querySelector("input[type='password']");

        if (!nomeInput || !emailInput || !senhaInput) {
            alert("❌ Erro interno: Um ou mais campos do formulário não foram localizados pelo script.");
            return;
        }

        const nomeValue = nomeInput.value;
        const emailValue = emailInput.value;
        const senhaValue = senhaInput.value;

        // Montagem do objeto usando LETRAS MINÚSCULAS (padrão que checamos para a sua tabela 'usuario')
        const novoUsuario = {
            nome: nomeValue,
            email: emailValue,
            senha: senhaValue
        };

        console.log("Dados validados e prontos para envio:", novoUsuario);

        try {
            await service.executarCadastro(novoUsuario, validadorVisitor);
        } catch (err) {
            alert(`❌ Falha no cadastro: ${err.message}`);
        }
    });