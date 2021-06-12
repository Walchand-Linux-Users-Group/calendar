var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql2/promise');

var app = express();
app.use(cors({ credentials: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var con = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: '',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

async function getuuid() {
    var found = false;
    var uuid;
    var q = 'SELECT * FROM remainders WHERE id = ';

    while (!found) {

        uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        var out = await con.query(q + mysql.escape(uuid));

        if (out[0].length == 0)
            found = true;
    }

    return uuid;
}

async function isUsed(id) {
    var found = true;

    var q = "SELECT * FROM remainders WHERE id = "+mysql.escape(id);
    console.log(q);

    var out = await con.query(q);
    console.log(out[0]);

    if (out[0].length == 0){
        found = false;
    }

    return found;
}

app.get('/api/getuuid', async function (req, res) {
    console.log("UID Generating...");
    // set response header
    res.writeHead(200, { 'Content-Type': 'application/json' });

    var uuidValue = await getuuid();
    console.log(uuidValue);

    // set response content    
    res.write(JSON.stringify({ uuid: uuidValue }));
    res.end();
 })

 app.post('/api/set_remainder', async function (req, res) {

        var body = req.body;

        var found = await isUsed(body.id);
        console.log(body.id+" => "+found);

        if(found){
            // Need to Update
            var query = "UPDATE remainders SET event_type = '" + body.event_type + "', color = '"+ body.color + "', dateTime = "+body.dateTime +", platform = '" + body.platform +"', topic = '"+body.topic + "' WHERE id = '"+body.id + "';";

            await con.query(query);

            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end('UPDATED')
        }
        else{
            // Need to Insert
            var query = "INSERT INTO remainders (id,event_type,color,dateTime,platform,topic) VALUES ('"+ body.id + "','" + body.event_type + "','" + body.color + "',"+ body.dateTime + ",'" + body.platform + "','" + body.topic +"');";

            await con.query(query);

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('INSERTED');
        }
});

app.post('/api/get_remainder', async function (req, res) {

    var body = req.body;

    var q = "SELECT * FROM remainders WHERE dateTime >= " + body.min + " AND dateTime <= "+ body.max + ";";
    console.log(q);

    var out = await con.query(q);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(out[0]));
    // console.log(JSON.stringify(out[0]));
})

var server = app.listen(5000, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })
