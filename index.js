const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());
var ObjectId = require('mongodb').ObjectId; 

const { MongoClient, ServerApiVersion} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.w5uf7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
    const database = client.db("task-1");
        const collection = database.collection("sectorcollection");

        app.post('/sectorcollection', async (req, res) => {
            const data = req.body;
            //console.log(data);
            const result = await collection.insertOne(data);
            //console.log(result);
            res.json(result);
        })
        app.get('/sectorcollection', async (req, res) => {
            const cursor = collection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        app.get('/sectorcollection/:id', async (req, res) => {
            const id = req.params.id;
            //console.log(id);
            const query = {_id: new ObjectId(id)};
            //console.log(query);
            const result = await collection.findOne(query);
            //console.log(result);
            res.send(result);
        })

        app.delete('/sectorcollection/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('trying to delete', id);
            const query = { _id: new ObjectId(id) }
            //console.log(query);
            const result = await collection.deleteOne(query);
            //console.log(result);
            res.send(result);
        });

        app.put('/sectorcollection/:id', async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) };
            const sector = req.body;
            console.log(sector);
            const option = { upsert: true };
            const updatedSector = {
                $set: {
                    name: sector.name,
                    option: sector.option,
                    check:sector.check
                }
            }
            const result = await collection.updateOne(filter, updatedSector, option)
            console.log(result);
            res.send(result);
        })
    }

    finally {

    }
    
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!hurrah')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })