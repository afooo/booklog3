var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req) return next('reqest is empty');
  res.render('index', { title: 'afoo' });
});

router.get('/hello', function(req, res, next){
  if(!req) return next('reqest is empty');
  res.render('hello', { title: 'hey', message: 'Hello Nicole!'});
});

router.get('/blog', function(req, res, next){
	if(!req) return next('reqest is empty');

	req.app.db.model.Post
	.find({})
	.populate('userId')
	.exec(function(err, posts){
		if(err) return next(err);
		if(!posts) return next('data is empty');
		res.render('blog', { posts: posts });
	});
});

router.get('/hello/:visitor', function(req, res, next) {
  if(!req) return next('reqest is empty');
  res.render('index', { title: req.params.visitor });
});

router.get('/', function(req, res, next) {
  if(!req) return next('reqest is empty');
  res.render('index', { title: 'Get Express' });
});

router.post('/', function(req, res, next) {
  if(!req) return next('reqest is empty');
  res.render('index', { title: 'Post Express' });
});

router.put('/', function(req, res, next) {
  if(!req) return next('reqest is empty');
  res.render('index', { title: 'Put Express' });
});

router.delete('/', function(req, res, next) {
  if(!req) return next('reqest is empty');
  res.render('index', { title: 'Delete Express' });
});

module.exports = router;
