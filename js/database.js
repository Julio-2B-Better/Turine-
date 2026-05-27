class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        
        // Credenciais globais de acesso ao banco PostgreSQL no Supabase
        this.url = ("create_enginepostgresql+psycopg2://postgres:CaBeMajLeSil@db.https://ehtykejbsikpbnkrkgsm.supabase.co/.supabase.co:5432/postgres");
        this.apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHlrZWpic2lrcGJua3JrZ3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Mzc5NDUsImV4cCI6MjA5NTMxMzk0NX0.X70vlrZBNl_q0F8zETdxYvYlqraj3l7fIq9GgL19Zac"; 
        
        DatabaseConnection.instance = this;
    }

    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    // Configura os cabeçalhos HTTP necessários para o protocolo REST do Supabase
    getHeaders() {
        return {
            "Content-Type": "application/json",
            "apikey": this.apiKey,
            "Authorization": `Bearer ${this.apiKey}`
        };
    }
}