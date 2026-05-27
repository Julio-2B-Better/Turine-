class PostgresLoginImplementor {
    constructor() { this.connection = DatabaseConnection.getInstance(); }
    async validarCredenciais(email, senha) {
    // Ajustado para bater certinho com a sintaxe PostgREST do Supabase
    const urlFormatada = `${this.connection.url}/USUARIO?EMAIL=eq.${encodeURIComponent(email)}&SENHA=eq.${encodeURIComponent(senha)}&select=*`;
    
    const response = await fetch(urlFormatada, {
        method: 'GET', 
        headers: this.connection.getHeaders()
    });
    
    if (!response.ok) throw new Error("Erro ao consultar usuário no banco de dados.");
    return await response.json();
}
}

class LoginService {
    constructor(bridge) { this.bridge = bridge; }
    async autenticar(email, senha) { return await this.bridge.validarCredenciais(email, senha); }
}

const loginService = new LoginService(new PostgresLoginImplementor());

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form"); // Adapte com o ID do seu formulário se houver
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = form.querySelector("input[type='email']").value;
        const senha = form.querySelector("input[type='password']").value;

        try {
            const usuarioLogado = await loginService.autenticar(email, senha);
            if (usuarioLogado.length > 0) {
                alert(`Bem-vindo de volta, ${usuarioLogado[0].NOME}!`);
                window.location.href = "../Tela_1_Home/pagina_inicial.html?status=logado";
            } else {
                alert("❌ Email ou senha incorretos.");
            }
        } catch (err) { alert(err.message); }
    });
});