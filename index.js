const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6v5oj5d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {

    try {
        const allTaskCollection = client.db('dailyTask').collection('allTaskCollection')
        const completeTaskCollection = client.db('dailyTask').collection('completeTaskCollection')



        app.get('/mytask', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await allTaskCollection.find(query).toArray()
            res.send(result)

        })

        app.get('/alltask1/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await allTaskCollection.findOne(query)
            res.send(result)
        })




        app.post('/addedtask', async (req, res) => {
            const addedTask = req.body
            const result = await allTaskCollection.insertOne(addedTask)
            res.send(result)

        })


        app.get('/completetask', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await completeTaskCollection.find(query).toArray()
            res.send(result)

        })


        app.post('/completedtask', async (req, res) => {
            const comTask = req.body
            const result = await completeTaskCollection.insertOne(comTask)
            res.send(result)

        })


        app.put('/complete/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updatedDoc = {
                $set: {
                    action: 'completed'
                }
            }
            const result = await allTaskCollection.updateOne(filter, updatedDoc, option)
            res.send(result)
        })


        app.get('/completetasks/:action/:email', async (req, res) => {

            const email = req.params.email
            const action = req.params.action
            let query = { email: email, action: action }
            const result = await allTaskCollection.find(query).toArray()
            res.send(result)

        })


        app.put('/incomplete/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updatedDoc = {
                $set: {
                    action: "incomplete"
                }
            }
            const result = await allTaskCollection.updateOne(filter, updatedDoc, option)
            res.send(result)
        })



        app.delete('/alltask/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await allTaskCollection.deleteOne(query)
            res.send(result)
        })



        app.delete('/completedtasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await allTaskCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }

}
run().catch(err => console.error(err))





app.get('/', (req, res) => {
    res.send('daily task!!')
})
app.listen(port, () => {
    console.log(`daily task server running on ${port}`)
})
