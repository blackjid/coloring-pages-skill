const ALEXA_APP_ID = process.env['ALEXA_APP_ID'];
const CSE_CX = process.env['CSE_CX'];
const CSE_API_KEY = process.env['CSE_API_KEY'];

import * as Alexa from 'alexa-sdk';
import { ColoringPages } from './coloring-pages'
import { PrinterErrors } from './coloring-pages/printer'

export function handler(event, context, callback){
  var alexa = Alexa.handler(event, context, callback);
  alexa.registerHandlers(handlers);
  alexa.appId = ALEXA_APP_ID;
  alexa.execute();
};

const handlers: Alexa.Handlers = {
  'PrintIntent': function(this: Alexa.Handler){
    let intent: Alexa.Intent = (<Alexa.IntentRequest>this.event.request).intent;
    let user: Alexa.SessionUser = this.event.session.user;

    if(!user.accessToken){
      this.emit(':tellWithLinkAccountCard', 'Please go to your Alexa app to link your Google account.');
    }
    // Check search query
    var searchTerm = intent.slots.drawings.value;
    if(!searchTerm){
      this.emit(':tell', 'Sorry, I didn\'t get that');
    }

    let coloringPages = new ColoringPages(user.accessToken, CSE_CX, CSE_API_KEY);

    return coloringPages.print(searchTerm)
      .then(() => {
        this.emit(':tell', 'Printing a ' + searchTerm + ', enjoy coloring!');
      })
      .catch((err) => {
        switch(err){
          case PrinterErrors.USER_CREDENTIAL_REQUIRED:
            this.emit(':tellWithLinkAccountCard', 'Please go to your Alexa app to link your Google account.');
          default:
            this.emit(':tell', 'Ups!, something went wrong');
        }
      })
  }
};
