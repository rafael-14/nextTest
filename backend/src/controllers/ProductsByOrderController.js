const connectionPG = require('../database');
const lastProcess = require('../functions/lastProcess');

module.exports = {
  async selectProductsByOrder(req, res) {
    let { id } = req.params;
    await connectionPG.query(`SELECT prod_ped.*, prod.nome
    FROM produtos_por_pedido prod_ped
    JOIN produto prod ON prod.id = prod_ped.id_produto
    WHERE prod_ped.id_pedido = ${id}`)
      .then(results => { productsByOrder = results.rows })
    let dataLastProcess = await lastProcess.lastProcess(productsByOrder)
    //A função chamada acima, retornará o último Processo de cada Produto
    for (let i = 0; i < dataLastProcess.length; i++) {
      await connectionPG.query(`SELECT * FROM producao
        WHERE id_processo = ${dataLastProcess[i].id_processo}
        AND id_produto = ${productsByOrder[i].id_produto}
        AND id_produto_pedido = ${productsByOrder[i].id}
        AND situacao = 4
        ORDER BY id DESC`)
        .then(results => { productionStatus = results.rows, productionStatusQuantity = results.rowCount })
      if (!productionStatus[0] || (productionStatusQuantity != productsByOrder[i].quantidade)) {
        productsByOrder[i].status = "Em Andamento"
      }
    }
    return res.json(productsByOrder)
  },

  async insertProductsByOrder(req, res) {
    let { orderID, orderProducts } = req.body;
    let datetime = new Date
    let insertProductsByOrder = [];
    for (let i = 0; i < orderProducts.length; i++) {
      await connectionPG.query(`INSERT INTO produtos_por_pedido
      (id_pedido, id_produto, sequencia, quantidade, data_pedido, observacao)
      VALUES(${orderID}, ${orderProducts[i].id}, ${i + 1}, ${orderProducts[i].productQuantity},
      '${datetime.toISOString().slice(0, 10)}', ${orderProducts[i].productNote !== "" ? `'${orderProducts[i].productNote}'` : null})
      RETURNING id AS id_produto_pedido, id_produto`)
        .then(results => { insertProductsByOrder = [...insertProductsByOrder, ...results.rows] })
    }
    return res.json(insertProductsByOrder).status(200)
  },
  
};