define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/collection_view',
    'views/base/user_item_view'
], function(_, Chaplin, utils, CollectionView, UserItemView) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UsersView = (function(_super) {

        utils.extends(UsersView, _super);

        function UsersView() {
            UsersView.__super__.constructor.apply(this, arguments);
        }

        _.extend(UsersView.prototype, {
            title: 'Users'

            className: 'row-fluid',
            container: 'div.row-fluid',
            itemView: UserItemView,
            listSelector: 'tbody',            
            autoRender: true,

            // Expects the serviceProviders in the options.
            initialize: function(options) {
                var view = this;

                UsersView.__super__.initialize.apply(view, arguments);
            }

        });

        return UsersView;

    })(CollectionView);

    return UsersView;
});