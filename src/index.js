var util = require('./storage-util');
var express = require('express');
var bodyparser = require('body-parser');

require('dotenv').config();

var app = express();
app.use(bodyparser.json());

app.listen(3000, () => {
    console.log('Server Running on Port 3000...');
});

// Endpoint for Saving Data to Azure Storage Container
app.post("/api/azstore", async (req, res, next) => {
    try {
        var containername = req.body.container;
        var name = req.body.name;
        var text = req.body.text;
        await util.write(containername, name, text);
        var responsetext = `Wrote blob value: ${containername} : ${name} : ${text}`;
        console.log(responsetext);
        res.json({message: responsetext});
    } catch(err) {
        next(err);
    }
});

// Endpoint for Reading Data from an Azure Storage Container
app.get('/api/azstore/:container/:blobname', async (req, res, next) => {
    try {
        var containername = req.params.container;
        var name = req.params.blobname;
        console.log(containername);
        console.log(name);
        var val = await util.read(containername, name);
        var respobj = {
            container: containername,
            name: name,
            text: val
        }; 
        console.log(respobj);
        res.json(respobj);
    } catch(err) {
        next(err);
    }
});
