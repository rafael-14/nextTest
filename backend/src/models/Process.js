const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    nome:String,
    ativo:Boolean,
    data_criacao:Date,
    data_inativacao:Date
}, {collection: 'processo', versionKey:false})

const product = mongoose.model('processo', DataSchema);
module.exports = product