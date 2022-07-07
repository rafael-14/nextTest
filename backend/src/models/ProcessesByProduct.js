const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    id_produto:Number,
    id_processo:Number,
    ativo:Boolean,
    data_criacao:Date,
    data_inativacao:Date
}, {collection: 'processos_por_produto', versionKey:false})

const product = mongoose.model('processos_por_produto', DataSchema);
module.exports = product