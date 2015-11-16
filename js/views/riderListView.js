var app = app || {};

app.RiderListView = Backbone.View.extend({
    initialize: function() {
        this.collection = new app.Riders(this.getRiders());
        this.listenTo(this.collection, 'add', this.renderList);
        this.listenTo(this.collection, 'add', this.saveRiders);
        this.listenTo(this.collection, 'change', this.saveRiders);
        this.renderList();
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

    saveRiders: function() {
        localStorage.setItem('ridersList', JSON.stringify(this.collection));
    },

    getRiders: function() {
        var rawListRiders = localStorage.getItem('ridersList');

        return JSON.parse(rawListRiders);
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