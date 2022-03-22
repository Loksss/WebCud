var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*res.render('index', { title: 'Express' });*/
  res.render("inicio");
});

/*WEB*/
router.get('/contacto', function(req, res, next) {
  /*res.render('index', { title: 'Express' });*/
  res.render("contacto");
});
/*WEB*/

module.exports = router;