const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5va2jyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const artCollection = client.db('artCraftDB').collection('artCraft');


        app.get('/artCraft', async (req, res) => {
            const cursor = artCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/artCraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.findOne(query)
            res.send(result);
        })


        app.post('/artCraft', async (req, res) => {
            const newCraft = req.body;
            console.log(newCraft);
            const result = await artCollection.insertOne(newCraft);
            res.send(result);

        })


        // myAddListCard
        app.get("/myList/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await artCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        // Delete Card
        app.delete('/artCraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.deleteOne(query)
            res.send(result);
        })


        app.get('/artCraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.findOne(query)
            res.send(result);
        })

        app.put('/artCraft/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCraft = req.body;
            const art = {

                $set: {
                    item: updatedCraft.item,
                    subcategory: updatedCraft.subcategory,
                    description: updatedCraft.description,
                    price: updatedCraft.price,
                    rating: updatedCraft.rating,
                    customization: updatedCraft.customization,
                    processing: updatedCraft.processing,
                    stock: updatedCraft.stock,
                    name: updatedCraft.name,
                    email: updatedCraft.email,
                    photo: updatedCraft.photo,
                }
            }
            const result = await artCollection.updateOne(filter, art, options)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



// root site
app.get('/', (req, res) => {
    res.send('Art & Craft Store server is running')
})

app.listen(port, () => {
    console.log(`Art & Craft Store server is running PORT: ${port}`)
})