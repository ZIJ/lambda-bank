define([
  'controllers/base/controller',
  'views/admin/header_view',
  'views/middle_view'
], function(Controller, HeaderView, MiddleView) {
  'use strict';

  var HeaderController = Controller.extend({
    
    initialize: function(params) {      
      this.view = new HeaderView();

      this.middleView = new MiddleView();

    }
  });

  return HeaderController;
});
