import * as google from 'googleapis';
import '../lib/googleapis/cloudprint';

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

    console.log(image)
    console.log(printer)
  }

  private async searchImage(searchTerm: string): Promise<{}>{
    const options = {
      cx: this.cseCX,
      auth: this.cseApiKey,
      q: `${searchTerm} coloring pages`,
      searchType: SEARCH_TYPE,
      imgSize: IMAGE_SIZE,
      imgType: IMAGE_TYPE,
    }

    return new Promise((resolve, reject) => {
      this.customsearch.cse.list(options, function (err, resp) {
        if (err) {
          reject(err);
        }
        if (resp.items && resp.items.length > 0) {
          let images = resp.items;
          let image = images[Math.floor(Math.random() * images.length)]
          resolve(image);
        }
      });
    });
  }

  private async searchPrinter(){
    return new Promise((resolve, reject) => {
      this.cloudprint.printers.search({}, function(err, resp){
        var printer = resp.printers[0]
        resolve(printer);
      })
    });
  }
}
