const connectionPG = require('../database');

module.exports = {
  async selectAllProducts(req, res) {
    let { product, page } = req.body;
    await connectionPG.query(`SELECT * FROM produto 
    ${product ? `WHERE nome ilike '%${product}%'` : ""}
    ORDER BY nome`)
      .then(results => { allProducts = results.rows })
    let count = allProducts.length
    return res.json({ allProducts: allProducts.splice((page - 1) * 10, page * 10), count })
  },

  async insertProduct(req, res) {
    let { productName } = req.body;
    let datetime = new Date
    await connectionPG.query(`INSERT INTO produto(nome,data_criacao)
    VALUES('${productName}', '${datetime.toISOString().slice(0, 10)}')
    RETURNING *`).then(results => { insertProduct = results.rows })
    return res.json(insertProduct[0]).status(200)
  },

  async inactivateProduct(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`UPDATE produto
    SET ativo=false, data_inativacao='${datetime.toISOString().slice(0, 10)}'
    WHERE id = ${id}`)
    return res.json().status(200)
  },

  async activateProduct(req, res) {
    let { id } = req.params;
    await connectionPG.query(`UPDATE produto SET ativo=true, data_inativacao=null
    WHERE id = ${id}`)
    return res.json().status(200)
  }
};