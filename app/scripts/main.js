/*global CostaCalypso, $*/


window.CostaCalypso = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        
    }
};

$(document).ready(function () {
    'use strict';
    CostaCalypso.init();
    //init map engine from John Saleigh
    var sansa = CostaSansa({
        width: 480,//960,
        height: 400,//600,
        scale: 640//1280
    });

    //start pulling from CMS
    var cms_model = new CostaCalypso.Models.CmsModel({wid: "713768a7b2088e"});
    cms_model.requestData();

    //create header
    var header_view = new CostaCalypso.Views.HeaderView({el: $("#header"), model: cms_model});

});
