/*global CostaCalypso, Backbone*/

CostaCalypso.Models = CostaCalypso.Models || {};

(function () {
    'use strict';

    CostaCalypso.Models.HeaderModel = Backbone.Model.extend({

        url: '',

        initialize: function() {
            console.log("init");
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
