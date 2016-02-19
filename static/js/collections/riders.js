var app = app || {};

app.Riders = Backbone.Collection.extend({
    model: app.Rider,
    url: '/api/rmt/riders',
    parse: function(response) {
    	return response.riders
    }
});