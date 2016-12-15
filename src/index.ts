const ALEXA_APP_ID = process.env['ALEXA_APP_ID'];
const CSE_CX = process.env['CSE_CX'];
const CSE_API_KEY = process.env['CSE_API_KEY'];

import * as Alexa from 'alexa-sdk';
import { ColoringPages } from './coloring-pages'
import { PrinterErrors, PageErrors } from './coloring-pages/errors'

export function handler(event, context, callback){
  var alexa = Alexa.handler(event, context, callback);
  alexa.registerHandlers(handlers);
  alexa.appId = ALEXA_APP_ID;
  alexa.execute();
};

const handlers: Alexa.Handlers = {

  'LaunchRequest': function(){
    this.emit('AMAZON.HelpIntent');
  },
  'PrintIntent': function(this: Alexa.Handler){
    let intent: Alexa.Intent = (<Alexa.IntentRequest>this.event.request).intent;
    let user: Alexa.SessionUser = this.event.session.user;

    // Check search query
    let searchTerm = intent.slots.drawings.value;
    if(searchTerm){
      let coloringPages = new ColoringPages(user.accessToken, CSE_CX, CSE_API_KEY);

      coloringPages.print(searchTerm)
        .then(() => {
          this.emit(':tell', 'Printing a ' + searchTerm + ', enjoy coloring!');
        })
        .catch((err) => {
          switch(err){
            case PrinterErrors.USER_CREDENTIAL_REQUIRED:
              this.emit(':tellWithLinkAccountCard', 'Please go to your Alexa app to link your Google account.');
              break;
            case PrinterErrors.NO_ONLINE_PRINTER:
              this.emit(':tell', 'Your printer is offline. Please turn it on and try again');
              break;
            case PrinterErrors.NO_OWNED_PRINTER:
              this.emit(':tell', 'Sorry, I cannot print, you don\'t have any printers associated with your Google Account');
              break;
            case PageErrors.NOT_FOUND:
              this.emit(':tell', `Sorry, I couldn't find a ${searchTerm} drawing for you to color`);
              break;
            default:
              this.emit(':tell', 'Ups!, something went wrong');
              break;
          }
        });
    }
    else{
      this.emit(':ask', 'Sorry, I didn\'t get that, what would like to print?', 'What do you want to print?');
    }
  },
  'AMAZON.HelpIntent': function(this: Alexa.Handler){
    let user: Alexa.SessionUser = this.event.session.user;

    let help = `
      What would you like to do? For example, you can say: print
      a <phoneme alphabet="ipa" ph="ˈmandələ">mandala</phoneme>,
      or print a guitar.
    `
    let helpRepromnt = `
      If you want to relax and have fun coloring, just ask
      me to print something. For example, you can say: print a
      landscape.
    `
    let linkHelp = `
      However, you need to link your Google Account so I can find your printers.
      Please go to your Alexa app to link your Google account.
    `

    if(!user.accessToken){
      this.emit(':tellWithLinkAccountCard', `${help}. ${linkHelp}`);
    }
    else{
      this.emit(':ask', help, helpRepromnt);
    }
  },
  'AMAZON.StopIntent': function(this: Alexa.Handler){
    this.emit(':tell', 'Ok');
  },
  'AMAZON.CancelIntent': function(this: Alexa.Handler){
    this.emit('AMAZON.StopIntent');
  },
  'Unhandled': function(this: Alexa.Handler) {
    this.emit(':tell', 'Sorry, I didn\'t get that');
  }
};