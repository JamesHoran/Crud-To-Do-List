import express from 'express';
import cors from 'cors';
const port = 3001;
const app = express();
app.use(cors());
// app.use(express.json());
// app.get('/', (req: Request, res: Response) => {
app.get(`http://localhost/${port}`, (req, res) => {
    res.send({ message: "json text here that has been updated" });
});
app.get('/more-data', (req, res) => {
    res.send({ message: "less data is here" });
});
app.listen(port, () => {
    console.log(`Server Started Successfully`);
});
