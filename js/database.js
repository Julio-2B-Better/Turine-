// Interface/Classe do Subject (Quem é observado)
class DatabaseSubject {
    constructor() {
        this.observers = [];
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notify(event, data) {
        this.observers.forEach(observer => observer.update(event, data));
    }
}

class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        
        // A URL correta para o Front-end é a URL da API REST do Supabase (HTTPS)
        this.url = "https://ehtykejbsikpbnkrkgsm.supabase.co/rest/v1"; 
        this.apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHlrZWpic2lrcGJua3JrZ3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Mzc5NDUsImV4cCI6MjA5NTMxMzk0NX0.X70vlrZBNl_q0F8zETdxYvYlqraj3l7fIq9GgL19Zac"; 
        
        DatabaseConnection.instance = this;
    }

    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    getHeaders() {
        return {
            "Content-Type": "application/json",
            "apikey": this.apiKey,
            "Authorization": `Bearer ${this.apiKey}`
        };
    }
}