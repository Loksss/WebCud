var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/ 

/*WEB*/     
 
var Noticia = require("../database/collections/noticia");
var Consulta = require("../database/collections/consulta");

 
  
router.get('/', async(req, res,)=> {
  /*res.render('index', { title: 'Express' });*/
  let noticia = await Noticia.find({})
    .limit(20)
    .sort({ id: -1 })
    .select("_id titulo descripcion");
  res.render("inicio", { noticia: noticia });
});

router.get('/noticia', async(req, res)=>{
  /*res.render('index', { title: 'Express' });*/
  res.render("noticia");
});


router.get("/noticiadetail/:id", async (req, res) => {
  var params = req.params;
  if (params.id == null) {
    res.status(200).json({
      msn: "Parametro necesario",
    });
    return;
  } 
  var docs = await Noticia.find({ _id: params.id });
  if (docs.length == 1) {
    res.render("noticiadetail", {docs:docs});
    return;
  }
  res.status(200).json({ msn: "El archivo no se encuenta" });
});
 
router.post('/noticia',async(req, res) => {
  var noticia = req.body;
  var noticia = {   
    titulo : req.body.titulo,                                 
    descripcion : req.body.descripcion
  };
  var noticiaData = new Noticia(noticia);
  noticiaData.save().then( (rr) => {
    //content-type
    res.status(200).json({
      "resp": 200,
      //"dato": newnoticia,
      "id" : rr._id,
      "msn" : "noticia registrado"
    });
  });
});

router.delete(/noticias\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Noticia.find({_id : id}).remove().exec( (err, docs) => {
    res.json({
        message: "Noticia Eliminado"
        });
  });
});

/*Consulta*/
router.get('/consulta', async(req, res)=>{
  let consulta = await Consulta.find({})
    .limit(20)
    .sort({ id: -1 })
    .select("pregunta respuesta");
  res.render("consulta", { consulta: consulta });
}); 

router.post('/consulta',async(req, res) => {
  var consulta = req.body;
  var consulta = {   
    pregunta : req.body.pregunta,                                 
    respuesta : req.body.respuesta
  };
  var consultaData = new Consulta(consulta);
  consultaData.save().then( (rr) => {
    //content-type
    res.status(200).json({
      "resp": 200,
      //"dato": newnoticia,
      "id" : rr._id,
      "msn" : "consulta registrado"
    });
  });
});
 
router.delete(/consulta\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Consulta.find({_id : id}).remove().exec( (err, docs) => {
    res.json({
        message: "Consulta Eliminado"
        });
  });
});
  
     
       
   
/*WEB*/               
 
module.exports = router; 