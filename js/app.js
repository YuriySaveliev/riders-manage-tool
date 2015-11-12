$(function() {
    var Rider = Backbone.Model.extend({
    defaults: {
        firstName: '',
        lastName: '',
        riderClass: 0,
        brand: 'None',
        size: 0,
        number: 0
    }
});

var Riders = Backbone.Collection.extend({
    model: Rider
});

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

var RiderUpdateModal = Backbone.View.extend({
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
        this.$el.modal('hide');
        listView.renderList();
    }
});

var rider = new Rider();
var listView = new RiderListView();
var riderModal = new RiderEditModal();
var riderUpdateModal = new RiderUpdateModal();
    
});
