/**
 * SETUP
 **/

var app = app || {};

/**
 * MODEL
 **/

app.contentModel = Backbone.Model.extend({
	url: function(){
		return 'http://localhost:3000/1/post'
				+ ( this.id === null ? '' : '/' + this.id );
	},
	id: '',
	defaults: {
		success: {},
		errfor: {},
		posts: []
	}
});

/**
 * VIEW
 **/

app.contentView = Backbone.View.extend({
	el: '#content',
	events: {
		'click #readOne' : 'readOne'
	},
	// constructor
	initialize: function(){
		this.model = new app.contentModel();
		this.template = _.template($('#postTemplate').html());
		this.model.bind('change', this.render, this);

		this.model.fetch();
	},
	render: function(){
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	readOne: function(evt){
		this.model.id = $(evt.target).data('id');
		this.template = _.template($('#readTemplate').html());
		this.model.fetch();
	}
});

app.formView = Backbone.View.extend({
	el: '#saveForm',
	initialize: function(){
		this.model = new app.contentModel();
	},
	events: {
		'click #savePost': "save",
	},
	save: function(evt){
		evt.preventDefault();
		
		// backbone > model > save([attirbutes], [options])
		this.model.save({
			title: this.$el.find('input[name="title"]').val(),
			content: this.$el.find('textarea[name="content"]').val()
		}, {
			success: function(model, response, options){
				console.log('contentView fetch');
				app.ContentView.model.fetch();
			}
		});
	}
});

$(document).ready(function(){
	app.ContentView = new app.contentView();
	app.FormView = new app.formView();
});

