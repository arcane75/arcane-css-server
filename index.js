const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//arcanecss
//KLIqUi36Zcf4DTxr
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aneek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("connected");
        const database = client.db('arcane-css');
        const productsCollection = database.collection('products');
    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('arcane CSS server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})