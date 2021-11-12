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
    const customer = database.collection("customer");
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
    // insert data one by one
    app.post("/jewelries", async (req, res) => {
      const cursor = req.body;
      const result = await jewelryCollection.insertOne(cursor)
      res.json(result);
    });
    // 
    app.post('/placeOrder',async (req,res)=> {
      const order = req.body;
      const result = await customer.insertOne(order);
      res.json(result);
    })
    
    app.get('/placedOrder',async (req,res)=>{
      const cursor = await customer.find({});
      const result = await cursor.toArray();
      res.send(result)
    })
    // delete order
    app.delete('/deleteOrder/:id',async (req,res) =>{
      const id = req.params.id;
      const result = await customer.deleteOne({
        _id:ObjectId(id)
      });
      res.send(result);
    })
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
