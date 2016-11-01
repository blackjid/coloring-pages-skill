var Alexa = require('alexa-sdk');
var ColoringPages = require('./coloring-pages.js')

var ALEXA_APP_ID = process.env['ALEXA_APP_ID'];


exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.appId = ALEXA_APP_ID;
  alexa.execute();
};

var handlers = {

  'PrintIntent': function () {
    var toSearch = this.event.request.intent.slots.drawings.value;
    var token = this.event.session.user.accessToken;

    return ColoringPages.searchAndPrint(toSearch, token)
      .then(function(resp){
        this.emit(':tell', 'Printing a ' + toSearch + ', enjoy coloring!');
      }.bind(this))
      .catch(function() {
        this.emit(':tell', 'Ups!, something went wrong');
          /* error :( */
      }.bind(this))
  }

};
