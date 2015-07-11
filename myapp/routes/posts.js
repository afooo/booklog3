var express = require('express');
var router = express.Router();
var events = require('events');

router.get('/1/post', function(req, res, next) {
	var workflow = new events.EventEmitter();

	workflow.once('authenticated', function(){
		if(req.isAuthenticated()){
			console.log('auth is true');
			return workflow.emit('listPost');
		}

		workflow.emit('authFail');
	});

	workflow.once('authFail', function(){
		console.log('auth is false');
		res.redirect('/auth/facebook');
	});

	workflow.on('listPost', function(){
		console.log('i got here');
		
		req.app.db.model.Post
			.find({})
			.populate('userId')
			.exec(function(err, posts){
				res.json(posts);
			});		
	});

	workflow.emit('authenticated');
});

router.get('/1/post/:id', function(req, res, next) {
	req.app.db.model.Post.findOne({ _id: req.params.id }, function(err, post){
		res.json(post);
	});
});

router.get('/1/title/:title', function(req, res, next) {
	req.app.db.model.Post.find({ title: req.params.title }, function(err, posts){
		res.json(posts);
	});
});

router.post('/1/post', function(req, res, next) {
	var workflow = new events.EventEmitter();
	var Post  = req.app.db.model.Post;

	workflow.outcome = {
		isAuth: false,
		success: false,
		errfor: {}
	};

	workflow.on('authenticate', function(){
		if(!req.isAuthenticated())
			res.redirect('/auth/facebook');

		workflow.outcome.isAuth = true;
		workflow.emit('validate');
	});

	workflow.on('validate', function(){
		if(typeof(req.query.title) === 'undefined' 
			|| req.query.title.length === 0)
			workflow.outcome.errfor.title = '請填寫標題哦';

		if(typeof(req.query.content) === 'undefined' 
			|| req.query.content.length === 0)
			workflow.outcome.errfor.content = '內容不可空白啦';

		if(Object.keys(workflow.outcome.errfor).length !== 0) {
				workflow.outcome.success = false;
				workflow.emit('response');
		}

		workflow.emit('savePost');
	});

	workflow.on('savePost', function(){
		var obj = new Post({
			title: req.query.title,
			content: req.query.content,
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
		res.send(workflow.outcome);
	});

	workflow.emit('authenticate');
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