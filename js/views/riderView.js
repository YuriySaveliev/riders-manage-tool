var app = app || {};

app.RiderView = Backbone.View.extend({
    initialize: function() {
        this.$riderUpdate = $('#rider-update');
    },

    events: {
        'click': 'openEditWindow'
    },

    className: 'rider-container col-lg-6 col-lg-offset-3',

    template: _.template($('#item-template').html()),

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

    openEditWindow: function() {
        var self = this;

        self.$riderUpdate.modal();
        self.$riderUpdate.find('form input').each(function(i, el) {
            $(el).val(self.model.get([el.id]));
        });
        Backbone.trigger('saveRider', self.model);
    }
});