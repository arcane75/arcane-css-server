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
        const allProductsCollection = database.collection('explore')
        const usersCollection = database.collection('users');
        const orderCollection = database.collection('order');
        const reviewCollection = database.collection('reviews');


        //GET products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        })

        //GET All products
        app.get('/explore', async (req, res) => {
            const cursor = allProductsCollection.find({});
            const allProducts = await cursor.toArray();
            res.json(allProducts);
        })

        //GET ALL ORDER
        app.get('/allOrder', async (req, res) => {
            const cursor = orderCollection.find({});
            const allOrder = await cursor.toArray();
            res.json(allOrder);
        })

        //GET reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        })

        //GET USER
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // GET my order
        app.get("/myOrder/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.json(result);
        });

        // add Package
        app.post("/addProduct", async (req, res) => {
            const addProduct = req.body;
            const result = await allProductsCollection.insertOne(addProduct);
            console.log(result);
            res.json(result);
        });

        // POST Review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })

        // POST Orders 
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        // Use POST to get data by keys
        app.post('/products/byKey', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await productsCollection.find(query).toArray();
            res.json(products);
        });


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // Delete Order
        app.delete("/deleteOrder/:id", async (req, res) => {
            // console.log(req.params.id);
            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.json(result);
        });

         // Delete Product
         app.delete("/deleteProduct/:id", async (req, res) => {
            // console.log(req.params.id);
            const result = await allProductsCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.json(result);
        });


        //UPDATE API
        app.put("/updateStatus/:id", async (req, res) => {
            const id = req.params.id;
            console.log("updated", id);
            // console.log(req);
            const updatedStatus = req.body;
            console.log(updatedStatus);

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            console.log('updated', id, req);
            res.json(result);

        })

       
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        })

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