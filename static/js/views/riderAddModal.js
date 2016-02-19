var app = app || {};

app.RiderAddModal = Backbone.View.extend({
    el: '#rider-edit',

    events: {
        'click #save': 'addRiderToList'
    },

    addRiderToList: function() {
        var formData = {};

        this.$el.find('form input').each(function(i, el) {
            formData[el.id] = $(el).val();
            $(el).val('');
        });

        app.listView.collection.create(formData);
        this.$el.modal('hide');
        app.listView.renderList();
    }
});