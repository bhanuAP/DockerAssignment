const http = require('http');
const app = require('./app.js');

const PORT = process.env.SERVICE_PORT;

const server = http.createServer(app);
server.listen(PORT);
console.log(`server listening at ${PORT}`);
