define([
  'controllers/base/controller',
  'models/admin/users',
  'views/admin/users_view'
], function(Controller, UsersCollection, UsersView) {
  'use strict';

  var UsersController = Controller.extend({
    
    initialize: function(params) {      
    	
    },

    index: function() {
    	var controller = this;

    	controller.collection = new UsersCollection();
    	

    	controller.view = new UsersView({
    		collection: controller.collection
    	});
    }

  });

  return UsersController;
});
