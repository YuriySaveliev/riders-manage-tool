var app = app || {};

app.RiderView = Backbone.View.extend({
    initialize: function() {
        this.$riderUpdate = $('#rider-update');
    },

    events: {
        'click .edit-btn': 'openEditWindow',
        'click .remove-btn': 'removeRider'
    },

    className: 'rider-container col-lg-6 col-lg-offset-3',

    template: _.template($('#item-template').html()),

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

    openEditWindow: function(e) {
        var self = this;

        self.$riderUpdate.modal();
        self.$riderUpdate.find('form input').each(function(i, el) {
            $(el).val(self.model.get([el.id]));
        });
        Backbone.trigger('saveRider', self.model);
    },

    removeRider: function() {
        this.model.destroy();
        this.remove();
        app.listView.saveRiders();
    }
});