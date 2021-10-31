
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const port = 5000;
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

app.use(cors());
app.use(express.json())




// user:  myfirstmongodb1
// password qVnd3W97wQCyAdh6
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l12hi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority `;

// const uri = "mongodb+srv://myfirstmongodb1:qVnd3W97wQCyAdh6@cluster0.l12hi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        console.log('database connected successfully')
        const database = client.db("tourimo_travle");
        const userCollection = database.collection("tour packeage");
        // to get users
        app.get('/packages', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })
        // create a document to insert
        app.post('/packages', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log('hitting the post', req.body);
            res.json(result);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);

        })

        // to delete users 
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            // const query = { _id: ObjectId(id) };
            // const result = await userCollection.deleteOne(query);
            // console.log('deleting user with id', result);
            // res.json(result);
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
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
            const updateUser = await userCollection.findOne(query);
            res.send(updateUser)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})