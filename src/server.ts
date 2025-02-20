import 'dotenv/config'
import type { Request, Response, Express } from 'express';
import express from 'express';
import cors from 'cors';
// import { MongoClient, ServerApiVersion } from 'mongodb';
import { MongoClient } from 'mongodb';
import { ServerApiVersion } from 'mongodb';

const uri: string | undefined = process.env.uri;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
if(uri) {
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
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
}

const port = 3001
const app: Express = express();

app.use(cors());

app.get(`/`, (req: Request, res: Response) => {
  res.send({ message: "json text here that has been updated"})
})

app.get('/more-data', (req: Request, res: Response) => {
  res.send({ message: "less data is here"})
})

app.listen(port, () => {
  console.log(`Server Started Successfully`)
})
