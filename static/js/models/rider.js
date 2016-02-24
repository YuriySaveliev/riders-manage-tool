var app = app || {};

app.Rider = Backbone.Model.extend({
    defaults: {
        firstName: '',
        lastName: '',
        riderClass: 0,
        brand: 'None',
        size: 0,
        numberRider: 0
    }
});