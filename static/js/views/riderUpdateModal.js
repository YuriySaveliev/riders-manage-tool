var app = app || {};

app.RiderUpdateModal = Backbone.View.extend({
    initialize: function() {
        this.listenTo(Backbone, 'saveRider', this.setModel);
    },

    el: '#rider-update',

    events: {
        'click #update': 'updateRider'
    },

    setModel: function(model) {
        this.model = model;
    },

    updateRider: function() {
        var formData = {};

        this.$el.find('form input').each(function(i, el) {
            formData[el.id] = $(el).val();
        });
        this.model.set(formData);
        this.model.save();
        this.$el.modal('hide');
        app.listView.renderList();
    }
});