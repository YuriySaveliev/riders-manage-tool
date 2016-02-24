var app = app || {};

app.RiderListView = Backbone.View.extend({
    initialize: function() {
        this.collection = new app.Riders();
        this.listenTo(this.collection, 'sync', this.renderList);
        this.collection.fetch({reset: true});
    },

    el: '#container',

    events: {
        'change .form-control': 'filterRiders'
    },

    renderItem: function(item) {
        var riderView = new app.RiderView({model: item});
        this.$el.find('#riders-list').append(riderView.render().el);
        return this;
    },

    renderList: function() {
        this.$el.find('#riders-list').empty();
        this.collection.each(function(item) {
            this.renderItem(item);
        }, this);
        return this;
    },

    filterRiders: function(e) {
        var filterValue = e.currentTarget.value,
            filteredList = [],
            self = this;

        if (filterValue === 'Any') {
            this.renderList();
        } else {
            filteredList = self.collection.where({riderClass: filterValue});
            this.$el.find('#riders-list').empty();
            $.each(filteredList, function(index, value) {
                self.renderItem(value);
            }); 
        }
    }
});