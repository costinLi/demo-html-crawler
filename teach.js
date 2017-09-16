var https = require('https');
var fs = require('fs');
// var _ = require('underscore');
var cheerio = require('cheerio');


var options = {
  hostname: 'www.qiushibaike.com',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6'
  }
};


var req = https.request(options, function(res) {

  var array = [];

  res.on('data', function(chunk) {
    array.push(chunk);
  });


  res.on('end', function() {
    var buffer = Buffer.concat(array);
    var html = buffer.toString('utf8');


    var $ = cheerio.load(html);

    // 1. 查找所有带内容的 div
    var divs = $('div.article.block.untagged.mb15');

    var data = [];

    // 2. 遍历
    divs.each(function (idx, dvObj) {

      var model = {
        author: $(dvObj).find('h2').text(),
        content: $(dvObj).find('div.content span').text()
      };

      data.push(model);
    });


    // 3. 写文件
    fs.writeFile('./text.json', JSON.stringify(data), function (err) {
      if (err) {
        throw err;
      }
      console.log('ok');
    });
  });
});


req.on('error', function(err) {
  console.log(err);
});


req.end();