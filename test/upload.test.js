const request = require('supertest');
const assert = require('assert');
const app = require('../http');
const crypto = require('crypto');
const fs = require('fs');

const imagePath = './test/test.gif';

describe('测试上传', () => {
  it('测试上传后的文件长度是否和原来的一样', (done) => {
    request(app)
      .post('/upload')
      .field('name', 'my awesome avatar')
      .attach('image', imagePath)
      .attach('jsFile', __filename)
      .then(({ body }) => {
        assert.equal(body.field.name, 'my awesome avatar', 'name字段不一样');
        assert.equal(fs.statSync(imagePath).size, body.file.image.size, '图片文件长度不一样');
        assert.equal(fs.statSync(__filename).size, body.file.jsFile.size, 'js文件长度不一样');
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
