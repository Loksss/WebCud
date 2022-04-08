const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var noticiaSchema = new Schema({
  titulo: String,
  descripcion: String,
  imagen: {
    type: String,
    default: ""
  },
  create: {
    type: Date,
    default: new Date()
  }
});
var noticia = mongoose.model("noticia", noticiaSchema);
module.exports = noticia;