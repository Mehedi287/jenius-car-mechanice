const express = require("express");
// for user name and password 
require('dotenv').config()
// for mongodb server connect 
const { MongoClient } = require('mongodb');
// call the cords 
const app = express();
// for single data 
const ObjectId = require('mongodb').ObjectId;
const cors = require("cors");
app.use(cors())
app.use(express.json())


const port = 5000;
// connect to the mongodb server 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faszq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const serviceCollection = database.collection("service");

        // pos api 
        app.post('/services', async (req, res) => {


            const service = req.body;

            const result = await serviceCollection.insertOne(service)
            console.log(result);
            res.json(result)
        })
        // get data 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray()
            res.send(result)
        })
        // get single data 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.json(result)
        })
        // delete a single data 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result)

        })

    }
    finally {

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("server is running")
});
app.listen(port, () => {
    console.log("runing from port", port);
});