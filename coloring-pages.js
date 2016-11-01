var google = require('googleapis');
var customsearch = google.customsearch('v1');
var Cloudprint = require('./cloud-print')
var cloudprint;

const CX = process.env['CSE_CX'];
const API_KEY = process.env['CSE_API_KEY'];

function searchAndPrint(term, token){
  return new Promise(function(resolve, reject) {
    searchImages(term)
      .then(function(results){
        var image = results[Math.floor(Math.random() * results.length)]
        var pageToPrint = {
          link: image.link,
          title: image.snippet
        }


        cloudprint = google.cloudprint({
          params: {
            headers: {
              "Authorization": 'OAuth ' +  token
            }
          }
        });

        printPage(pageToPrint)
          .then(function(response){
            resolve();
          })
          .catch(function(){
            reject();
          });
      });
    });
  }

function searchImages(term){
  const options = {
    cx: CX,
    q: term + 'coloring pages',
    auth: API_KEY,
    searchType: 'image',
    imgSize: 'xlarge',
    imgType: 'lineart',
  }

  return new Promise(function(resolve, reject) {
    customsearch.cse.list(options, function (err, resp) {
      if (err) {
        reject(err);
      }
      if (resp.items && resp.items.length > 0) {
        resolve(resp.items);
      }
    });
  });
}

function printPage(page){
  return new Promise(function(resolve, reject) {
    getPrinter().then(function(printer){
      var job = {
        printerid: printer.id,
        title: page.title,
        ticket: '{"version": "1.0","print": {}}',
        content: page.link,
        contentType: 'url'
      };

      cloudprint.jobs.submit(job, function(err, resp){
        if(resp.success === true) resolve();
        else if(resp.success === false) reject(resp.message);
      })
    });
  });
}

function getPrinter(){
  return new Promise(function(resolve, reject) {
    cloudprint.printers.search({}, function(err, resp){
      var printer = resp.printers[0]
      resolve(printer);
    })
  });
}

exports.searchAndPrint = searchAndPrint;