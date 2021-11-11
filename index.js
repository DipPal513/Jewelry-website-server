const express = require("express");
const mongodb = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
app.use(express.json());
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uzftm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("simple-Jewelry-website");
    const jewelryCollection = database.collection("jewelryCollection");

    app.post("/jewelries", async (req, res) => {
      const jewelries = req.body;
      const result = jewelryCollection.insertOne(jewelries);
      req.json(result);
    });
    // find data using id
    app.get('/jewelries/:id',async (req,res) => {
      const id = req.params.id;
      const query = {_id : ObjectId(id)}
       const order = await jewelryCollection.findOne(query);
        res.send(order);
    })
    // get all data
    app.get("/jewelries", async (req, res) => {
      const cursor = jewelryCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // client.close();
  }
}
run().catch((err) => console.dir);

app.get("/", (req, res) => {
  res.send("some data");
});

app.listen(port, () => {
  console.log("running server on port ", port);
});
