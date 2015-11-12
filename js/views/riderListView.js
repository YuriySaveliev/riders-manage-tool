var RiderListView = Backbone.View.extend({
    initialize: function() {
        this.collection = new Riders(this.getRiders());
        this.listenTo(this.collection, 'add', this.renderList);
        this.listenTo(this.collection, 'add', this.saveRiders);
        this.listenTo(this.collection, 'change', this.saveRiders);
        this.renderList();
    },

    el: '#container',

    events: {
        'change .form-control': 'filterRiders'
    },

    template: _.template($('#list-template').html()),

    renderItem: function(item) {
        var riderView = new RiderView({model: item});
        this.$el.append(riderView.render().el);
        return this;
    },

    renderList: function() {
        this.$el.html(this.template());
        this.collection.each(function(item) {
            this.renderItem(item);
        }, this);
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
            this.$el.html(this.template());
            $.each(filteredList, function(index, value) {
                self.renderItem(value);
            }); 
        }
    }
});