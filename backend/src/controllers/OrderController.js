const connectionPG = require('../database');
const lastProcess = require('../functions/lastProcess');

module.exports = {
  async selectAllOrders(req, res) {
    let { direction, orderStatus, orderNumber, startDate, endDate, page } = req.body;
    let dateClause
    if (startDate && endDate) {
      dateClause = `data_pedido BETWEEN '${startDate}' AND '${endDate} 23:59:59.999-03'`
    } else if (startDate && !endDate) {
      dateClause = `data_pedido BETWEEN '${startDate}' AND CURRENT_DATE`
    } else if (!startDate && endDate) {
      dateClause = `data_pedido <= '${endDate} 23:59:59.999-03'`
    }
    await connectionPG.query(`SELECT * FROM pedido
      ${orderNumber ? `WHERE id = ${orderNumber}` : ""}
      ${dateClause ? `WHERE ${dateClause}` : ""}
      ORDER BY 1 ${direction ? "ASC" : "DESC"}
      --LIMIT 10 OFFSET 10 * ${page - 1}`)
      .then(results => { allOrders = results.rows })
    //Retorna todos os pedidos
    for (let i = 0; i < allOrders.length; i++) {
      await connectionPG.query(`SELECT id, id_produto, quantidade FROM produtos_por_pedido WHERE id_pedido = ${allOrders[i].id}`)
        .then(results => { idStatus = results.rows })
      //Retorna o ID e o ID dos produtos de cada pedido na tabela produtos_por_pedido
      let dataLastProcess = await lastProcess.lastProcess(idStatus)
      //A função chamada acima, retornará o último Processo de cada Produto
      for (let j = 0; j < dataLastProcess.length; j++) {
        await connectionPG.query(`SELECT * FROM producao
          WHERE id_processo = ${dataLastProcess[j].id_processo}
          AND id_produto = ${idStatus[j].id_produto}
          AND id_produto_pedido = ${idStatus[j].id}
          AND situacao = 4
          ORDER BY id DESC`)
          .then(results => { productionStatus = results.rows, productionStatusQuantity = results.rowCount })
        if (!productionStatus[0] || (productionStatusQuantity != idStatus[j].quantidade)) {
          allOrders[i].status = "Em Andamento"
        }
      }
    }
    if (orderStatus === "InProgress") {
      allOrders = allOrders.filter(allOrders => allOrders.status === "Em Andamento")
    }
    if (orderStatus === "Concluded") {
      allOrders = allOrders.filter(allOrders => !allOrders.status)
    }
    let count = allOrders.length
    return res.json({ allOrders: allOrders.splice((page - 1) * 10, page * 10), count })
  },

  async insertOrder(req, res) {
    let datetime = new Date
    await connectionPG.query(`INSERT INTO pedido
      (data_pedido)
      VALUES('${datetime.toISOString()}')
      RETURNING id`).then(results => { insertOrder = results.rows })
    return res.json(insertOrder[0]).status(200)
  },

};