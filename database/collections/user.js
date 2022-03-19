const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var userSchema = new Schema({
  deviceid: String,
  nombre: String,
  ru: Number,
  email: String,
  password: String,
  institucion: String,
  role: String,
  create: {
    type: Date,
    default: new Date()
  }
});
var user = mongoose.model("user", userSchema);
module.exports = user;