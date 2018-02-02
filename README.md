# 实现一个简单的fromidable

## 脚本
```sh
npm run start
访问 localhost:3333
```

## 单元测试
```sh
npm run test

➜  easy-formidable npm run test

> easy-formidable@1.0.0 test /Users/jimmytu/wbb/demo/node/easy-formidable
> mocha ./test



  测试上传
name 完成
image 完成
jsFile 完成
    ✓ 测试上传后的文件长度是否和原来的一样 (42ms)


  1 passing (48ms)
```


## Example

Parse an incoming file upload.
```javascript
const http = require('http');
const Formidable = require('./formidable');

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
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="file" name="upload1" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
});

module.exports = server;
```

## 其他
```javascript
  class Formidable extends EventEmitter {
    ....
  }
```
Formidable继承EventEmitter，可以进行一些事件的触发
 例如:
```javascript
  formidable.on('fileComplete', (name) => {
    console.log(name, '完成');
  });
  formidable.on('fieldComplete', (name) => {
    console.log(name, '完成');
  })
```
 每一个文件或者字段被解析完成会触发相应的事件
