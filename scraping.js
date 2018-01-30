var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var forEach = require('async-foreach').forEach;

var types = ['business', 'data', 'design', 'iot', 'programming', 'security', 'web-ops', 'web-platform'];

forEach(types, function(item) {
  var baseurl = 'http://www.oreilly.com/' + item + '/free/';

  request(baseurl, function(err, res) {

    if(!err && res.statusCode === 200) {
      scrapeData(res, item, baseurl);
    }
  });
});

function scrapeData(res, folderName, getUrl) {
  var $ = cheerio.load(res.body);
  var links = $('.product-row a');
  for(var i = 0, len = links.length; i < len; i++) {
    var cleanLink = links[i].attribs.href.split('/');
    var getFileName = cleanLink[cleanLink.length - 1];
    // strip query parameters
    var removedQuestionMarks = getFileName.split('?');
    var cleanedLink = removedQuestionMarks[0].replace('.csp', '.pdf');
    if(!fs.existsSync("files/" + folderName)) {
      fs.mkdirSync("files/" + folderName);
    }
    request(getUrl + 'files/' + cleanedLink).pipe(fs.createWriteStream('files/' + folderName + '/' + cleanedLink));
  }
}
