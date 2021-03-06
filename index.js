const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l12hi.mongodb.net/tourimo_travle?retryWrites=true&w=majority `;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        // console.log('database connected successfully')
        const database = client.db("tourimo_travle");
        const packageCollection = database.collection("tour packeage");
        const guideCollection = database.collection("tourist_guide");
        const confirmPackageCollection = database.collection("confirmPackage");
        const reviewCollection = database.collection("usersReviews");
        // to get package
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        // POST API
        app.post('/packages', async (req, res) => {
            console.log('hitting the post')
            const packageAdd = req.body;
            console.log('hit the post api', packageAdd);
            const result = await packageCollection.insertOne(packageAdd);
            console.log(result);
            res.json(result)
            res.send('hitted ')
        });
        // to get guide 

        app.get('/guides', async (req, res) => {
            const cursor = guideCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        // create a document to insert
        // POST API
        app.post('/confirms', async (req, res) => {
            console.log('hitting the post')
            const packageConfirm = req.body;
            console.log('hit the post api', packageConfirm);

            const result = await confirmPackageCollection.insertOne(packageConfirm);
            console.log(result);
            res.json(result)
            res.send('hitted ')
        });

        // confirm package 
        app.get('/confirms', async (req, res) => {
            const cursor = confirmPackageCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })
        // delete confirm package api 
        app.delete('/confirms/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleting with id', id);
            const query = { _id: ObjectId(id) };
            const result = await confirmPackageCollection.deleteOne(query);
            res.json(result);
        })


        // to delete users 
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packageCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.", result);
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }
            res.json(result)

        })

        // update api 
        app.put('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const options = { upsert: true };
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            console.log('updating this id', result);
            res.json(result)
        })
        // find for updateUser 
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateUser = await packageCollection.findOne(query);
            res.send(updateUser)
        })

        // get reviews ..................start 
        // post reviews 
        app.post('/review', async (req, res) => {
            const reviews = req.body;
            console.log(reviews)
            const result = await reviewCollection.insertOne(reviews);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })

        // get api 
        app.get('/review', async (req, res) => {
            // const email = req.query.email;
            // const query = { email: email }
            const cursor = reviewCollection.find({})
            const appointments = await cursor.toArray();
            res.json(appointments)
        })



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello TORIMO!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})