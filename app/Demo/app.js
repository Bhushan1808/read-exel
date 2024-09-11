const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const cors = require('cors');

app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow all HTTP methods
    allowedHeaders: '*',  // Allow all headers
  }));

const url = 'mongodb://localhost:27017';
const dbName = 'exel-db';  
const client = new MongoClient(url);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function fetchDataFromMongo(collectionName, equipmentNo) {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    const searchList = equipmentNo.EquipmentNumber
    var findList=[]
    if(typeof searchList !== 'object'){
        findList=[parseInt(searchList), searchList]
    }
    else{
        findList = [...searchList.map(x=>parseInt(x)), ...searchList.map(x=>x.toString())]
    }
    console.log(findList)
    return await collection.find({EquipmentNumber : { $in: findList }}).toArray(); 
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

app.get('/api/kommissionen', async (req, res) => {
  try {
    const data = await fetchDataFromMongo('kommissionen', req.query); 
    res.json(data); 
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get('/api/sap', async (req, res) => {
    try {
      const data = await fetchDataFromMongo('sap-exel', req.query); 
      res.json(data); 
    } catch (error) {
      res.status(500).send("Error fetching data");
    }
  });

  app.get('/api/multi-eq', async (req, res) => {
    try {
      const data = await fetchDataFromMongo('kommissionen', req.query); 
      res.json(data); 
    } catch (error) {
      res.status(500).send("Error fetching data");
    }
  });

const port = 3000;
app.listen(port, async () => {
  await connectToMongoDB(); 
  console.log(`Server is running on http://localhost:${port}`);
});