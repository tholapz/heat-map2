/*global CostaCalypso, Backbone, JST*/

CostaCalypso.Views = CostaCalypso.Views || {};

(function () {
    'use strict';

    CostaCalypso.Views.HeaderView = Backbone.View.extend({

        template: JST['app/scripts/templates/HeaderView.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }

    });

})();
