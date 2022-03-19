var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
//var _ = require("underscore");
var sha1 = require('sha1');
var jwt = require("jsonwebtoken");

var User = require("../../../database/collections/user");
/*
 * 
 * 
 * 
 * USUARIO
 * 
 * 
 * 
*/
router.post("/loginweb", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var result = User.findOne({email: email,password: sha1(password)}).exec((err, doc) => {
    if (err) {
      res.status(300).json({
        msn : "No se puede concretar con la peticion "
      });
      return;
    }
    console.log(doc);
    if (doc) {
       console.log(result);
      //res.status(200).json(doc);
      jwt.sign({name: doc.email, password: doc.password},"secretkey123",(err, token) => {
          console.log(result);
          res.status(200).json({
            resp:200,
            token :token,
            dato:doc
          });
      })
    } else {
      res.status(400).json({
        resp: 400,
        msn : "El Usuario no existe"
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var deviceid = req.body.deviceid;
  var result = User.findOne({email: email,password: sha1(password)}).exec((err, doc) => {
    if (err) {
      res.status(300).json({
        msn : "No se puede concretar con la peticion "
      });
      return;
    }
    console.log(doc);
    if (doc) {
       console.log(result);

        if(deviceid != doc.deviceid)
        {
          res.status(400).json({
            msn : "Error! No esta en iniciando sesión en su dispositivo"
          });
          return;
        }

      //res.status(200).json(doc);
      jwt.sign({name: doc.email, password: doc.password}, /*{expiresIn: "1h"},*/ "secretkey123", (err, token) => {
          console.log(result);
          res.status(200).json({
            resp:200,
            token : token,
            dato:doc
          });
      })
    } else {
      res.status(400).json({
        resp: 400,
        msn : "El Usuario no existe"
      });
    }
  });
});

//Middelware
function verifytoken (req, res, next) {
  //Recuperar el header
  const header = req.headers["authorization"];
  if (header  == undefined) {
      res.status(403).json({
        msn: "No autorizado"
      })
  } else {
      req.token = header.split(" ")[1];
      jwt.verify(req.token, "secretkey123", (err, authData) => {
        if (err) {
          res.status(403).json({
            msn: "No autorizado"
          })
        } else {
          next();
        }
      });
  }
}
//http://52.67.0.248
router.post('/user',async(req, res) => {
  //Ejemplo de validaciones
  var user = req.body;
  var name_reg = /\w{3,}/g
  var email_reg = /\w{1,}@[\w.]{1,}[.][a-z]{2,3}/g
  var password_reg =/\w{6,}/g
  var contact_reg = /\d{7}[0-9]/g
  
  if(user.nombre.match(name_reg) == null){
    res.status(400).json({
      msn : "debe insertar un nombre"
    });
    return;
  }
  if (req.body.nombre == "" && req.body.email == "") {
    res.status(400).json({
      "msn" : "formato incorrecto"
    });
    return;
  }

  if(user.email.match(email_reg) == null){
    res.status(400).json({
      msn : "el email no es correcto"
    });
    return;
  }

  var nombre = req.body.nombre;
  var nombres = await User.find({nombre: nombre});
  if (nombres.length > 0) {
    res.status(400).json({"resp": 400,"msn":"Ya existe el usuario"});
    return;
  }

  var email = req.body.email;
  var emails = await User.find({email: email});
  if (emails.length > 0) {
    res.status(400).json({"resp": 400,"msn":"Ya existe el email"});
    return;
  }

  var ru = req.body.ru;
  var rus = await User.find({ru: ru});
  if (rus.length > 0) {
    res.status(400).json({"resp": 400,"msn":"No se puede duplicar un R.U"});
    return;
  }
  var user = {   
    deviceid : req.body.deviceid,                                 
    nombre : req.body.nombre,
    ru : req.body.ru,
    email : req.body.email,
    password : req.body.password,
    institucion : req.body.carrera,
    role : /*["user","admin"]*/req.body.role
  };
  user.password = sha1(user.password);
  var usuarioData = new User(user);

  usuarioData.save().then( (rr) => {
    //content-type
    res.status(200).json({
      "resp": 200,
      //"dato": newusuario,
      "id" : rr._id,
      "msn" : "Usuario registrado"
    });
  });
});


router.get('/user',async(req,res, next) => {
  var params = req.query;
  var limit = 100;
  if(params.limit != null){
    limit = parseInt(params.limit);
  }
  var order = -1;
  if(params.sort != null){
    if(params.sort == "desc") {
      order = -1;
    }else if (params.sort == "asc") {
      order = 1;
    }
  }
/*
  var date = new Date().toISOString().match(/\d{2}[\/\-]\d{2}[\/\-]\d{2}/)[0];
  console.log('fecha:'+date);
  var servertime = new Date();
  var horaserver = servertime.getHours();
  var minuteserver = servertime.getMinutes();
  console.log('hora:'+horaserver,minuteserver);*/
  var filter = {};
  if(params.id != null){
    filter= {_id: params.id};
    }
    var fil = {};
    if(params.email != null){
      fil= {email: params.email}; }
  var skip = 0;
  if (params.skip != null) {
    skip = parseInt(params.skip);
  }
  var list = await User.find(filter).limit(limit).sort({_id: order}).skip(skip).find(fil);
  res.status(200).json(list);
});

router.delete(/user\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  User.find({_id : id}).remove().exec( (err, docs) => {
    res.json({
        message: "Usuario Eliminado"
        });
  });
});

router.patch("/user", async(req, res) => {
  var params = req.body;
  var id = req.query.id;
  if (id == null) {
    res.status(300).json({
      msn: "Introduzca ID"
    });
    return;
  }
 
  var result = await User.findOneAndUpdate({_id: id},params);
  res.status(200).json(result);
});
 
/*
 * 
 * 
 * 
 * USUARIO
 * 
 * 
 * 
*/
module.exports = router;