var RiderView = Backbone.View.extend({
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

        $('#rider-update').modal();
        $('#rider-update').find('form input').each(function(i, el) {
            $(el).val(self.model.get([el.id]));
        });
        Backbone.trigger('saveRider', self.model);
    }
});