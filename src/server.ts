import type { Request, Response, Express } from 'express';
import express from 'express';
import cors from 'cors';

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
