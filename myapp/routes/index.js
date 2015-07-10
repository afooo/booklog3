var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'afoo' });
});

router.get('/hello/:visitor', function(req, res, next) {
  res.render('index', { title: req.params.visitor });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Get Express' });
});

router.post('/', function(req, res, next) {
  res.render('index', { title: 'Post Express' });
});
router.put('/', function(req, res, next) {
  res.render('index', { title: 'Put Express' });
});
router.delete('/', function(req, res, next) {
  res.render('index', { title: 'Delete Express' });
});

module.exports = router;
