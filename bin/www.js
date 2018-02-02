const server = require('../http');

server.listen(3333);

server.on('error', (error) => {
  console.log(error);
});
