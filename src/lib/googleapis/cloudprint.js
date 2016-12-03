'use strict';

var googleapis = require('googleapis');
var createAPIRequest = require('googleapis/lib/apirequest');
var utils = require('googleapis/lib/utils');

function Cloudprint(options) {

  var self = this;
  self._options = options || {};

  self.printers = {
    search: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.google.com/cloudprint/search',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
            url: 'https://www.google.com/cloudprint/printer',
            method: 'POST'
        }, options),
        params: params,
        requiredParams: ['printerid'],
        pathParams: [],
        context: self
      };
      return createAPIRequest(parameters, callback);
    }
  }

  self.jobs = {
    submit: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.google.com/cloudprint/submit',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['printerid','title','ticket','content'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }
  }
}

googleapis.addAPIs({
  cloudprint: function(options) {
    var api = new Cloudprint(options);
    api.google = this; // it is called from google api so `this` is google api. it needs it.
    return Object.freeze(api);
  }
});

module.exports = Cloudprint;
