var express = require('express');
var router = express.Router();
var events = require('events');

// facebook authenticate
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth/facebook');
}

router.get('/1/post', ensureAuthenticated);
router.get('/1/post', function(req, res, next) {
	var workflow = new events.EventEmitter();
	var Post  = req.app.db.model.Post;

	workflow.outcome = {
		success: false,
		errfor: {}
	};

	workflow.on('validate', function(){
		console.log('validate');
		workflow.emit('listPost');
	});

	workflow.on('listPost', function(){
		console.log('listpost');
		Post
			.find({})
			.populate('userId')
			.exec(function(err, posts){
				workflow.outcome.success = true;
				workflow.outcome.posts = posts;
				workflow.emit('response');
			});		
	});

	workflow.on('response', function(){
		console.log('response');
		res.send(workflow.outcome);
	});

	workflow.emit('validate');
});

router.get('/1/post/:id', function(req, res, next) {
	var workflow = new events.EventEmitter();
	var Post  = req.app.db.model.Post;

	workflow.outcome = {
		success: false,
		errfor: {}
	};

	workflow.on('validate', function(){
		console.log('validate');
		workflow.emit('listPost');
	});

	workflow.on('listPost', function(){
		Post
			.findOne({ _id: req.params.id })
			.exec(function(err, post){
				workflow.outcome.success = true;
				workflow.outcome.post = post;
				workflow.emit('response');
			});
	});

	workflow.on('response', function(){
		console.log('response');
		res.send(workflow.outcome);
	});

	workflow.emit('validate');
});

router.get('/1/title/:title', function(req, res, next) {
	req.app.db.model.Post.find({ title: req.params.title }, function(err, posts){
		res.json(posts);
	});
});

//router.post('/1/post', ensureAuthenticated);
router.post('/1/post', function(req, res, next) {
	var workflow = new events.EventEmitter();
	var Post  = req.app.db.model.Post;

	workflow.outcome = {
		success: false,
		errfor: {}
	};

	workflow.on('validate', function(){
		console.log(req.body);
		if(typeof(req.body.title) === 'undefined' 
			|| req.body.title.length === 0) {
			console.log('no title');
			workflow.outcome.errfor.title = '請填寫標題哦';
		}

		if(typeof(req.body.content) === 'undefined' 
			|| req.body.content.length === 0) {
			console.log('no content');
			workflow.outcome.errfor.content = '內容不可空白啦';
		}

		if(Object.keys(workflow.outcome.errfor).length !== 0) {
				workflow.outcome.success = false;
				workflow.emit('response');
		}

		workflow.emit('savePost');
	});

	workflow.on('savePost', function(){
		var obj = new Post({
			title: req.body.title,
			content: req.body.content,
			userId: req.user._id
		});

		obj.save(function(err, post){
			workflow.outcome.success = true;
			console.log('save was successful');
			workflow.outcome.post = post;

			workflow.emit('response');
		});
	});

	workflow.on('response', function(){
		console.log('save res');
		res.send(workflow.outcome);
	});

	workflow.emit('validate');
});

router.put('/1/post/:id', function(req, res, next){
	req.app.db.model.Post.findByIdAndUpdate( req.params.id,
		{ content: "day off!" }, function(err, post){
			res.json(post);
		});
});

router.delete('/1/post/:id', function(req, res, next){
	req.app.db.model.Post.findByIdAndRemove( req.params.id, function(err, post){
		res.send('delete was successful!');
	});
});

module.exports = router;