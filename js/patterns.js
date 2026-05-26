class TuriNEObserver {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify(dados) {
        this.subscribers.forEach(callback => callback(dados));
    }
}

class EstatisticasVisitor {
    visitPontoTuristico(listaPontos) {
        const total = listaPontos.length;
        const porTipo = listaPontos.reduce((acc, ponto) => {
            const tipo = ponto.T_TIPO || 'NÃO ESPECIFICADO';
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
        }, {});
        return { total, porTipo };
    }

    visitHistoricoAlteracoes(listaHistorico) {
        const totalAcoes = listaHistorico.length;
        const porAcao = listaHistorico.reduce((acc, log) => {
            const acao = log.ACAO || 'OUTRA';
            acc[acao] = (acc[acao] || 0) + 1;
            return acc;
        }, {});
        return { totalAcoes, porAcao };
    }
}