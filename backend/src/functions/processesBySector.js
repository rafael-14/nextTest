const connectionPG = require('../database/');

//Retorna os IDs dos processos que as pessoas executam dentro de um determinado setor
//Ex.:
//Setor X, tem fulano, siclano e beltrano
//Retorna os IDs dos processos cujo fulano, siclano e beltrano tem permissão para executar
module.exports = {
    async processesBySector(id_setor) {
        await connectionPG.query(`SELECT proc_user.id_processo
        FROM usuarios_por_setor user_set
        JOIN processos_por_usuario proc_user ON proc_user.id_usuario = user_set.id_usuario
        WHERE user_set.id_setor = ${id_setor}`)
            .then(results => {processesBySector = results.rows })
        return processesBySector
    }
}

