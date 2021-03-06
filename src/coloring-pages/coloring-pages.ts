import * as google from 'googleapis';
import '../lib/googleapis/cloudprint';
import { PrinterErrors, PageErrors } from './errors';

const SEARCH_TYPE = 'image';
const IMAGE_SIZE = 'xlarge';
const IMAGE_TYPE = 'lineart';

export default class ColoringPages {
  oAuthtoken: string;
  cseCX: string;
  cseApiKey: string;
  cloudprint: google.cloudprint.Cloudprint;
  customsearch: google.customsearch.v1.Customsearch;

  constructor(oAuthtoken: string, cseCX: string, cseApiKey: string){
    this.oAuthtoken = oAuthtoken;
    this.cseCX = cseCX;
    this.cseApiKey = cseApiKey;

    this.customsearch = google.customsearch('v1');

    var options = {
      params: {
        headers: {
          'Authorization': `OAuth ${this.oAuthtoken}`
        }
      }
    }
    this.cloudprint = google.cloudprint(options);
  }

  async print(term: string){
    let searchImagePromise = this.searchImage(term);
    let searchPrinterPromise = this.searchPrinter();

    let results = await Promise.all([searchImagePromise, searchPrinterPromise]);
    let image = results[0];
    let printer = results[1];

    return this.printPage(printer, image['title'], image['link'])
  }

  private async searchImage(searchTerm: string): Promise<{}>{
    let startIndex = Math.floor(Math.random() * 60)

    const options = {
      cx: this.cseCX,
      auth: this.cseApiKey,
      q: `${searchTerm} coloring pages`,
      searchType: SEARCH_TYPE,
      imgSize: IMAGE_SIZE,
      imgType: IMAGE_TYPE,
      num: 1,
      start: startIndex
    }

    return new Promise((resolve, reject) => {
      this.customsearch.cse.list(options, function (err, resp) {
        if (err) {
          reject(err);
        }
        else if(resp.items && resp.items.length === 0){
          reject(PageErrors.NOT_FOUND);
        }
        else if (resp.items && resp.items.length > 0) {
          let images = resp.items;
          let image = images[0]
          resolve(image);
        }
      });
    });
  }

  private async searchPrinter(){
    return new Promise((resolve, reject) => {
      this.cloudprint.printers.search({}, function(err, resp){
        if(err == null && typeof resp === 'object'){
          let ownedPrinters = resp.printers.filter(printer => {
            return printer.tags.indexOf('^own') > -1
          })
          let onlineOwnedPrinters = ownedPrinters.filter(printer => {
            return printer.connectionStatus == 'ONLINE';
          })

          if (ownedPrinters.length === 0){
            reject(PrinterErrors.NO_OWNED_PRINTER)
          }
          else if (onlineOwnedPrinters.length === 0){
            reject(PrinterErrors.NO_ONLINE_PRINTER)
          }
          else{
            var printer = onlineOwnedPrinters[0]
            resolve(printer);
          }
        }
        else if(typeof resp === 'string' && /Error 403/.test(resp)){
          reject(PrinterErrors.USER_CREDENTIAL_REQUIRED);
        }
        else {
          reject(err);
        }
      })
    });
  }

  private async printPage(printer, title, link){
    return new Promise((resolve, reject) => {
      var job = {
        printerid: printer.id,
        title: title,
        ticket: '{"version": "1.0","print": {}}',
        content: link,
        contentType: 'url'
      };

      this.cloudprint.jobs.submit(job, function(err, resp){
        if(resp.success === true) resolve();
        else if(resp.success === false) reject(resp.message);
      })
    });
  }
}
