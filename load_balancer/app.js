const fs = require("fs");
const express = require("express");
const request = require("request");
const ServiceHandler = require("./handler/serviceHandler");

const app = express();
const serviceHandler = new ServiceHandler();
const timeStamp = () => new Date();

app.use(express.json());

app.use((req, res, next) => {
    let log = `${timeStamp()}: Requested for ${req.url}`;
    fs.appendFile('./logs/requestLogs.log', log + "\n", (err) => {
        if (err) throw err;
        console.log(`The "${log}" was appended to file!`);
    });
    next();
});

app.post('/register', (req, res) => {
  let service = req.body;
  serviceHandler.register(service);
  res.status(200);
  res.end();
});

app.get('/number', (req, res) => {
  let service = serviceHandler.getNextService();
  request.get(`http://${service.name}:${service.port}/number`)
  .on('response', function(response) {
    console.log(response);
    // console.log(response.statusCode)
    // console.log(response.headers['content-type'])
  });
  res.end();
});

module.exports = app;
