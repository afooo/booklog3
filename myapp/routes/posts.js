var express = require('express');
var router = express.Router();

/* read/post/update/delete articles */
/*
router.get('/1/post', function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/auth/facebook');
});
*/
router.get('/1/post', function(req, res, next) {
	req.app.db.model.Post
		.find({})
		.populate('userId')
		.exec(function(err, posts){
		res.json(posts);
	});
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
	var post = new req.app.db.model.Post({
		title: "July 10",
		content: "typhoon arriving"
	});

	post.save();

	res.json(post);
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
