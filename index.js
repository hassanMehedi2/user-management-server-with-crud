const express = require('express');
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.slqgxau.mongodb.net/?retryWrites=true&w=majority`;

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

    const usersCollection = client.db("userDB").collection("users");

    app.get('/user', async (req, res) => {
      const cursor = usersCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })
    app.get(`/user/:id`,async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const user = await usersCollection.findOne(query);
      res.send(user);
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    app.delete(`/user/:id`,async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result)
    })

    app.put(`/user/:id`,async(req,res)=>{
      const id = req.params.id;
      const user = req.body;
      const filter = {_id: new ObjectId(id)};
      const updatedUser = {
        $set:{
          name: user.name,
          email: user.email,
          gender: user.gender,
          status: user.status
        }
      }
      const result = await usersCollection.updateOne(filter,updatedUser);
      res.send(result);

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



app.get('/', (req, res) => {
  res.send("User management server is running ");
})

app.listen(port, () => {
  console.log("server is running on port : ", { port });
})