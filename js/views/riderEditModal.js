var RiderEditModal = Backbone.View.extend({
    model: rider,

    el: '#rider-edit',

    events: {
        'click #save': 'addRiderToList'
    },

    addRiderToList: function() {
        var formData = {};

        this.$el.find('form input').each(function(i, el) {
            formData[el.id] = $(el).val();
        });

        listView.collection.add(new Rider(formData));
        this.$el.modal('hide');
        listView.renderList();
    }
});