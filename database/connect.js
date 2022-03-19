const mongoose = require('mongoose');
mongoose.connect("mongodb://172.18.0.2:27017/crud",{ useNewUrlParser: true, useUnifiedTopology: true });
module.exports = mongoose;
//172.18.0.2