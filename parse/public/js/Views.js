var Views = {
	SelectView: Backbone.View.extend({
		template: _.template($("#selectTemplate").text()),
		events : {
			'change select' : 'optionsChange'
		},
		initialize : function(args){
			var model = this.model = {
				options: []
			};
			args.model.forEach(function(option, i) {
				model.options.push(option.get('name'));
			});

			debugger;
			this.render(args);
			this.setCurrent(args.value || 0);
		},
		render: function(args) {
			this.$el = $(args.$el);
			this.$el.html(this.template(this.model));
			return this;
		},
		setCurrent : function(value){
			this.$el.val(value);
		},

		optionsChange : function(e) {
			this.trigger('change',e.target.value);
		}
	})
}