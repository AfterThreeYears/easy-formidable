const http = require('http');
const Formidable = require('./formidable');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8');

const server = http.createServer((req, res) => {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    const formidable = new Formidable();
    formidable.parse(req, (err, file, field) => {
      if (err) {
        res.end(JSON.stringify(err));
        return;
      }
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ file, field }));
    });
    formidable.on('fileComplete', (name) => {
      console.log(name, '完成');
    });
    formidable.on('fieldComplete', (name) => {
      console.log(name, '完成');
    })
    return;
  }
  res.writeHead(200, {'content-type': 'text/html'});
  // res.end(
  //   '<form action="/upload" enctype="multipart/form-data" method="post">'+
  //   '<input type="text" name="title"><br>'+
  //   '<input type="file" name="upload" multiple="multiple"><br>'+
  //   '<input type="file" name="upload1" multiple="multiple"><br>'+
  //   '<input type="submit" value="Upload">'+
  //   '</form>'
  // );
  res.end(html);
});

module.exports = server;
