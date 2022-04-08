const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var consultaSchema = new Schema({
  pregunta: String,
  respuesta: String,
  create: {
    type: Date,
    default: new Date()
  }
});
var consulta = mongoose.model("consulta", consultaSchema);
module.exports = consulta;