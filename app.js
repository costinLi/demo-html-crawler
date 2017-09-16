/**
 * create by ulysess 2017-09-16
 */

const https = require('https');
const fs = require('fs');

const cheerio = require('cheerio')
const options = {
  hostname: 'www.qiushibaike.com',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    // 'Accept-Encoding':'gzip, deflate, br',
    'Accept-Language':'zh-CN,zh;q=0.8',
    'Cache-Control':'max-age=0',
    'Connection':'keep-alive',
    'Host':'www.qiushibaike.com',
    // 'If-None-Match':"4838c2bd899a8636468314b7fabb981d636b55eb",
    // 'Upgrade-Insecure-Requests':'1',// 表示客户端优先选择加密及带有身份验证的响应
    'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36',
  }
};

const req = https.request(options, (res) => {
  // res.setEncoding('utf8');
  var html = [];
  res.on('data', (chunk) => {
    html.push(chunk);
  });
  res.on('end', () => {
    console.log('No more data in response.');
    // console.log( html  );
    html = Buffer.concat(html).toString();
    // 输出到 一个 html 文件中 
    // fs.writeFile('./qiushi.html',html,e=>{
    //   if (e) {
    //     throw e;
    //   }
    //   console.log('ok');
    // })
    var joke = []
    var authorReg = /<h2>\s*(.*)\s*<\/h2>/gi;
    var contentReg = /<div class="content">\s*<span>\s*(.*)\s*.*\s*<\/span>\s*(<span class=\"contentForAll\">查看全文<\/span>)?\s*<\/div>/gi;
    while (result = authorReg.exec(html)) {
      var obj = {
        author: result[1],
        content: contentReg.exec(html)[1]
      }
      joke.push(obj);
    }
    fs.writeFile('./qiushi.json',JSON.stringify(joke),e=>{
        if (e) {
          throw e;
        }
        console.log('ok');
      })
  });
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

// write data to request body
// req.write(postData);
req.end();