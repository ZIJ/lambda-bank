define([
    'underscore',
    'models/base/model'
], function(_, Model) {
    'use strict';

    var CardType = Model.extend({
        parse: function(response) {
            var attributesHash = {
                id: response['Id'],
                name: response['Name']
            };

            _(attributesHash).each(function(attrValue, attrName) {
                if (typeof attrValue === "undefined") {
                    delete attributesHash[attrName];
                }
            });

            return attributesHash;
        }
    });

    return CardType;
});