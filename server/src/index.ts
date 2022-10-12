//import all dependencies
const express = require('express');
const cors = require('cors');
const env = require('dotenv').config();
//taking port from .env file
const PORT = process.env.SERVER_PORT || 3001;

//init backend
const app = express();

const db = [
    {id: 1, title: "123"},
    {id: 2, title: "1234"},
    {id: 3, title: "1235"},
    {id: 4, title: "1236"},
]


app.use(cors());
app.use(express.json());

app.get('/', (req: any, res: any) => {
    res.sendStatus(200);
});

app.get('/api/db', (req: any, res: any) => {
    let querydb = db;

    if(req.query.title) {
        querydb = querydb
            .filter(e => e.title.indexOf(req.query.title) > -1);
    }

    res.json(querydb);
});

app.get('/api/db/:id', (req: any, res: any) => {
    res.json(db.filter(e => e.id === +(req.params.id)));
});

app.post('/api/db', (req: any, res: any) => {
    const createdTitle = {
        id: +(new Date());
        title: req.body.title
    }

    db.push(createdTitle);
    res.json(createdTitle);
});



app.listen(PORT,() => console.log(`server started at port ${PORT}`));