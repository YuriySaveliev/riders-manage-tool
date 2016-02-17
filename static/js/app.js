var app = app || {};

$(function() {

    app.rider = new app.Rider();
    app.listView = new app.RiderListView();
    app.riderModal = new app.RiderAddModal();
    app.riderUpdateModal = new app.RiderUpdateModal();

});
