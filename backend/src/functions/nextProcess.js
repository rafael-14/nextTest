const connectionPG = require('../database/');

module.exports = {
    async nextProcess(productID, processID) {
        await connectionPG.query(`SELECT * FROM processos_por_produto proc_prod
            JOIN processo proc ON proc.id = proc_prod.id_processo
            WHERE id_produto = ${productID}
            AND id_processo = ${processID}`)
            .then(results => { nextProcess = results.rows })
        for (let i = 0; i < nextProcess.length; i++) {
            await connectionPG.query(`SELECT * FROM processos_por_produto proc_prod
                JOIN processo proc ON proc.id = proc_prod.id_processo
                WHERE id_produto = ${productID}
                AND sequencia = ${nextProcess[i].sequencia + 1}`)
                .then(results => { nextProcess = results.rows })
        }
        
        return nextProcess
    }
}