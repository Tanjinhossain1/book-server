const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()


app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zat3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const booksCollection = client.db("bookInventory").collection("books");
        // get all books 
        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = booksCollection.find(query);
            const books = await cursor.toArray();
            res.send(books)
        })
        // add book with id 
        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await booksCollection.findOne(query);
            res.send(book)
        })
        // add new book itemd
        app.post('/books', async (req,res)=>{
            const newBook = req.body;
            const result = await booksCollection.insertOne(newBook);
            res.send(result)
        })
        //  quantity delete
        app.put('/books/:id', async (req, res) => {
            const id = req.params.id
            const quantity = req.body.quantitys;
            
            const filter = { _id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: quantity
                },
              };
            const result = await booksCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // update bookQuantity 
        app.put('/bookNewQuantity/:id', async (req, res) => {
            const id = req.params.id
            const quantity = req.body.addNewQuantity;
            // console.log(newQuantity)
            const filter = { _id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: quantity
                },
              };
            const result = await booksCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // Delete book inventory
        app.delete('/deleteBook/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const bookDelete = await booksCollection.deleteOne(query);
            res.send(bookDelete)
        })
    }
    finally {
        // client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})