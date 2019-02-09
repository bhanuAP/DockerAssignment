const fs = require("fs");
const express = require("express");
const request = require("request");
const Pool = require("pg").Pool;

const app = express();
const timeStamp = () => new Date();

const pool = new Pool({
    user: 'postgres',
    password: '',
    database: 'postgres',
    host: 'db',
    port: 5432
});

pool.query("CREATE TABLE IF NOT EXISTS data(numbers int)", (error, results) => {
    if (error) {
        console.error("Error -------> " + error);
        return;
    }
    console.log("Table created");
});

request.post(`http://${process.env.PROXY_NAME}:${process.env.PROXY_PORT}/register`, {
  json: {
    name: `${process.env.SERVICE_NAME}`,
    port: `${process.env.SERVICE_PORT}`
  }
}, (err, response, body) => {
  if (err) {
    console.log(err);
  }
});

app.use(express.json());

app.use((req, res, next) => {
    let log = `${timeStamp()}: Requested for ${req.url}`;

    fs.appendFile('./logs/requestLogs.log', log + "\n", (err) => {
        if (err) throw err;
        console.log(`The "${log}" was appended to file!`);
    });
    next();
});

app.post('/number', (req, res) => {
    pool.query(`INSERT INTO data VALUES(${req.body.number})`, (error, result) => {
        if (error) throw error;
        // console.log(`Inserted data sucessfully`);
        res.send("Inserted data sucessfully");
    });
});

app.get('/number', (req, res) => {
    pool.query("SELECT numbers FROM data", (error, results) => {
        if (error) throw error;
        let result = results.rows.map(element => element.numbers);
        // console.log(result);
        res.send(JSON.stringify(result));
    });
});

module.exports = app;
