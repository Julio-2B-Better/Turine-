class PostgresCadastroImplementor {
    constructor() {
        this.connection = DatabaseConnection.getInstance();
    }

    async inserirUsuario(dadosUsuario) {
        const response = await fetch(`${this.connection.url}/USUARIO`, {
            method: 'POST',
            headers: {
                ...this.connection.getHeaders(),
                // Esse cabeçalho pede para o Supabase retornar o objeto criado (opcional)
                "Prefer": "return=representation" 
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (!response.ok) {
            const erroDetalhado = await response.json();
            throw new Error(erroDetalhado.message || "Erro ao salvar os dados no banco.");
        }

        return await response.json();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    const cadastroService = new PostgresCadastroImplementor();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Captura os dados das caixas de texto do seu HTML
        const nome = form.querySelector("input[placeholder*='Nome']").value; // Ajuste o seletor conforme seu HTML
        const email = form.querySelector("input[type='email']").value;
        const senha = form.querySelector("input[type='password']").value;

        // Monta o objeto exatamente com os nomes das COLUNAS do seu banco de dados
        const novoUsuario = {
            NOME: nome,
            EMAIL: email,
            SENHA: senha
        };

        try {
            await cadastroService.inserirUsuario(novoUsuario);
            alert("🎉 Cadastro realizado com sucesso!");
            
            // Redireciona o usuário para a tela de login
            window.location.href = "../Tela_2_Login/login.html";
        } catch (err) {
            alert(`❌ Falha no cadastro: ${err.message}`);
        }
    });
});