
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const fs = require('fs');
const bsplit = require('buffer-split')
const mime = require('mime');
const uuid = require('uuid');
const statAsync = util.promisify(fs.stat);

class Formidable extends EventEmitter {
  constructor() {
    super();
  }
  parse(req, callback) {
    try {
      const body = [];
      const handleData = (chunk) => {
        body.push(chunk);
      };
      const handleEnd = async () => {
        const boundary = Buffer.from(`--${req.headers['content-type'].split('=')[1]}`);
        const bufList = bsplit(Buffer.concat(body), boundary);
        bufList.pop();
        bufList.shift();
        const file = {};
        const field = {};
        const writePromiseList = Array.from(bufList).map((item) => {
          return new Promise((resolve, reject) => {
            const str = item.toString();
            const filenameReg = /filename="(.+)"/;
            const nameReg = /name="(.+?)"/;
            const contentTypeReg = /Content-Type:\s(.*)/;
            const filenameResult = str.match(filenameReg);
            const key = str.match(nameReg)[1];
            if (filenameResult) {
              const filename = filenameResult[1];
              const type = str.match(contentTypeReg)[1];
              const extension = mime.getExtension(type);
              const filePath = `/tmp/${uuid()}.${extension}`;
              const ws = fs.createWriteStream(filePath);
              // 去掉文件类型后的换行和内容开始前的空号
              const sourceBuf = bsplit(item, Buffer.from('\r\n\r\n'))[1];
              // 去掉最后的换行
              const buf = sourceBuf.slice(0, sourceBuf.length - 2)
              ws.write(buf, () => {
                this.emit('fileComplete', key);
                file[key] = {
                  ...fs.statSync(filePath),
                  path: filePath,
                  type,
                  filename,
                };
                resolve();
              });
              ws.on('error', (error) => {
                reject(error);
              });
            } else {
              this.emit('fieldComplete', key);
              field[key] = bsplit(item, Buffer.from('\r\n'))[3].toString();
              resolve();
            }
          });
        });
        await Promise.all(writePromiseList);
        callback(null, file, field);
      };
      const handleError = (error, callback) => {
        callback(error);
      }
      req.on('data', handleData);
      req.on('end', handleEnd);
      req.on('error', handleError);
    } catch (error) {
      callback(error);
    };
    
  }
}

module.exports = Formidable;
