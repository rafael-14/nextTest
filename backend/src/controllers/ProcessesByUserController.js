const connectionPG = require('../database');

module.exports = {
  async insertProcessesByUser(req, res) {
    let { userID, vinculatedProcess } = req.body;
    let datetime = new Date
    for (let i = 0; i < vinculatedProcess.length; i++) {
      await connectionPG.query(`INSERT INTO processos_por_usuario
      (id_usuario, id_processo, data_criacao)
      VALUES(${userID}, ${vinculatedProcess[i]}, '${datetime.toISOString().slice(0, 10)}')`)
    }
    return res.json().status(200)
  },

  async selectProcessesByUser(req, res) {
    let { id } = req.params;
    await connectionPG.query(`SELECT * FROM processos_por_usuario proc_user
    JOIN processo proc ON proc.id = proc_user.id_processo
    WHERE proc_user.id_usuario = ${id}`)
      .then(results => { processesByUser = results.rows })
    return res.json(processesByUser)
  },

  async verifyProcessesByUser(req, res) {
    let { userID, processID } = req.body;
    for (let i = 0; i < processID.length; i++) {
      await connectionPG.query(`SELECT * FROM processos_por_usuario
      WHERE id_usuario = ${userID} AND id_processo = ${processID[i]}`)
        .then(results => { processByUser = results.rows })
      if (processByUser.length === 0) {
        return res.json({ status: 400 })
      }
    }
    return res.json({ status: 200 })
  },

};