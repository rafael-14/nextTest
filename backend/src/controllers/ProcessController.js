const connectionPG = require('../database');

module.exports = {
  async selectAllProcesses(req, res) {
    let { page, process } = req.body;
    await connectionPG.query(`SELECT * FROM processo
    ${process ? `WHERE nome ilike '%${process}%'` : ""}
    ORDER BY 2`)
      .then(results => { allProcesses = results.rows })
    let count = allProcesses.length
    return res.json({ allProcesses: allProcesses.splice((page - 1) * 10, page * 10), count })

  },

  async insertProcess(req, res) {
    let { processName } = req.body;
    let datetime = new Date
    await connectionPG.query(`INSERT INTO processo(nome,data_criacao)
    VALUES('${processName}', '${datetime.toISOString().slice(0, 10)}')`)
    return res.json().status(200)
  },

  async inactivateProcess(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`UPDATE processo
    SET ativo=false, data_inativacao='${datetime.toISOString().slice(0, 10)}'
    WHERE id = ${id}`)
    return res.json().status(200)
  },

  async activateProcess(req, res) {
    let { id } = req.params;
    await connectionPG.query(`UPDATE processo
    SET ativo=true, data_inativacao=null
    WHERE id = ${id}`)
    return res.json().status(200)
  }
};