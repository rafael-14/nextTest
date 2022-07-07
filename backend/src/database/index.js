const {Pool} = require('pg')
const pgConfig = require('../config/PG_Connection')

const PG_Connection = new Pool(pgConfig);

//module.exports = (connection, PG_Connection);
module.exports = PG_Connection;