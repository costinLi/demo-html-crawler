/**
 * create by ulysess 2017-09-16
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
/** 服务端 类似于 jQuery 的库 */
const cheerio = require('cheerio')
const distDir = './result/'

const options = {
  hostname: 'www.zhihu.com',
  // https 默认就是 443
  port: 443,
  path: '/billboard',
  method: 'GET',
  timeout: 10000,
  // 直接从浏览器请求拷贝过来的
  headers: {
    'accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
    'accept-encoding': `gzip, deflate, br`,
    'accept-language': `zh-CN,zh;q=0.9`,
    'cache-control': `no-cache`,
    'pragma': `no-cache`,
    'sec-ch-ua': `" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"`,
    'sec-ch-ua-mobile': `?0`,
    'sec-fetch-dest': `document`,
    'sec-fetch-mode': `navigate`,
    'sec-fetch-site': `none`,
    'sec-fetch-user': `?1`,
    'upgrade-insecure-requests': `1`,
    'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36`
  }
};

// Gip 解压
function unGZip (b) {
  return new Promise((resolve, reject) => {
    zlib.gunzip(b, function(err, decoded) {
      if (err) reject(err);
      resolve(decoded);
    })
  })
}

const req = https.request(options, (res) => {
  var html = [];
  
  res.on('data', (chunk) => {
    html.push(chunk);
  });

  res.on('end', async () => {
    console.log('response data over.');
    html = await unGZip(Buffer.concat(html));
    html = html.toString('utf8');
    // 输出到 一个 html 文件中  查看抓取是否成功
    // fs.writeFile(distDir + 'result.html', html, e => {
    //   if (e) { throw e }
    //   console.log('HTML success');
    // })
    var data = []
    var $ = cheerio.load(html);
    // 抓取列表
    var linkItmes = $('a.HotList-item');
    linkItmes.each(function (idx, dvObj) {
      // 提取信息
      var item = {
        metrics: $(dvObj).find('.HotList-itemMetrics').text(),
        title: $(dvObj).find('.HotList-itemTitle').text()
      };
      data.push(item);
    });
    // 存储数据
    fs.writeFile(distDir + 'index.json', JSON.stringify(data), e => {
      if (e) { throw e; }
      console.log('JSON success');
    })
  });
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

req.end();