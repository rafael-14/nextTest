const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    nome:String,
    ativo:Boolean,
    data_criacao:Date,
    data_inativacao:Date
}, {collection: 'produto', versionKey:false})

const product = mongoose.model('product', DataSchema);
module.exports = product