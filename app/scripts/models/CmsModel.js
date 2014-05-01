/*global CostaCalypso, Backbone*/

CostaCalypso.Models = CostaCalypso.Models || {};

(function () {
    'use strict';

    CostaCalypso.Models.CmsModel = Backbone.Model.extend({
        apiUrl: '//secureapi.votenow.tv/widgets/get',
        defaults: {
            /**
             * The widget ID to retrieve.
             * Should be found in the URL Query String Parameter or hardcoded in "initialize()"
             */
            wid: '713768a7b2088e',
            /**
             * The snapshot ID (if necessary).
             * Should be found in the URL Query String Parameter
             */
            sid: null,
            useSID: null,
            /**
             *  Timestamp of widget
             */
            ts: null,
            /**
             * system clock of user
             */
            localTime: new Date().getTime(),
            /**
             *
             */
            startTime: null,
            /**
             * number set by comparing startTime against the server time
             */
            countdownStatus: null,
            /**
             *
             */
            windowStatus: null,
            /**
             * Widget Text
             */
            text: {},
            /**
             * Widget Settings
             */
            settings: {},
            /**
             * Widget CSS
             */
            css: {},
            /**
             * Widget Data: Vote Options, Poll and Trivia Questions, Mood Buttons
             */
            data: [],
            /**
             * Social Configuration: Facebook and Twitter app and share info
             */
            social: {},
            /**
             * All data from CMS API
             */
            raw: {},
            /**
             * The number of seconds to wait before updating again.
             */
            updateFrequency: 20,
            /**
             *
             */
            failureCount: 0,
            /**
             *
             */
            failureLimit: 10,
            /**
             *
             */
            pollTimer: null,
            /**
             *
             */
            initialized: false
        }
        /**
         *
         */
        , initialize: function(attributes, options) {
            var wid = "713768a7b2088e";
            var sid = "4541";
            var useSID = "4541";

            console.log('CmsModel initialize', wid, sid, useSID);

            this.set({
                wid: wid
                ,useSID: sid
            });
        }
        /**
         * Builds the URL to fetch data from the Connect API
         */
        ,prepareApiUrl: function() {
            var url = (
                this.get('wid').search(/\//) == -1 ?
                    // If there is a numeric wid provided, then use the base
                    // url and query for that particular id.
                    window.location.protocol + this.apiUrl + "?wid=" + this.get('wid') + (!_.isNull(this.get('useSID'))? '&sid='+ this.get('useSID') : '')
                    // Otherwise, get the file specified by the wid field.
                    : this.get('wid') + "?" + Math.random()
                );
            return url;
        }
        /**
         *
         */
        ,requestData:function() {
            this.xhr = $.ajax({
                url: this.prepareApiUrl()
                , type: "GET"
                , dataType: 'json'
                , crossDomain: true
                , success: _.bind(this.requestSuccess, this)
                , error: _.bind(this.requestError, this)
            });
        }
        /**
         *
         */
        ,requestSuccess: function(data, textStatus, jqXHR) {
            console.log('CmsModel requestSuccess', data, textStatus, jqXHR);
            if(!(_.isObject(data) && _.size(data) > 0)){
                this.requestError();
                return;
            }
            
            // Condition met on first callback or if the sid has change,
            // If met, pass all the retrieved keys to be mapped onto the Model
            var parsedData = (data.sid && this.get('sid') != data.sid || !this.get('initialized'))? data : {}
                ,startTime = new Date(data.text.start_time).getTime();

            // extending some of the nested data as top level attributes for easy listening
            this.set(_.extend(parsedData, {
                initialized: true
                ,raw: data // Update full CMS output
                ,ts: data.ts
                ,windowStatus: parseInt(data.settings.window_status, 10)
                ,localTime: new Date().getTime()
                ,startTime: startTime
                ,countdownStatus: ( startTime > data.ts ? 0 : 1 )
            }));

            console.log('model data', this.toJSON());

            this.pollData();

        }
        /**
         *
         */
        ,requestError: function(xhr, text, textError) {
            console.log('requestError', xhr, text, textError);
            this.set({
                failureCount: (parseInt(this.get('failureCount'), 10) + 1)
            });
            this.pollData();
        }
        /**
         * @return unix timestamp in ms (server timestamp plus time elapsed since the last request to the server)
         */
        , getServerTime: function () {
            // console.log('getServerTime', 'ts', (this.get('ts')*1000), 'elapsed', this.getElapsedTime(), (this.get('ts')*1000) + this.getElapsedTime());
            return (this.get('ts')) + this.getElapsedTime();
        }
        /**
         * @return ms time elapsed since the last request to the server
         */
        , getElapsedTime: function () {
            return (new Date().getTime() - this.get('localTime'));
        }
        /**
         * @returns unix timestamp in ms
         * @param time - unix timestamp which should always be greater than (in the future of) the server time
         */
        , getCountdownTime: function (time) {
            // ms difference between the server time and the future sunrise/sunset time
            var difference = (time - this.getServerTime());
            // use local time plus the difference
            return new Date(new Date().getTime() + difference).getTime();
        }
        /**
         * sets our polling timer
         */
        , pollData: function () {
            if (this.get('failureCount') >= this.get('failureLimit'))
                return;

            this.set({
                pollTimer: setTimeout(_.bind(this.requestData, this), parseInt(this.get("updateFrequency"), 10) * 1000)
            });
        }
    })
})();
