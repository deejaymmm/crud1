console.log('May Node be with you');
const express = require('express'); // use express
const bodyParser= require('body-parser');  // place body-parser before your CRUD handlers! 
const app = express(); // use express
const MongoClient = require('mongodb').MongoClient; // connect to MongoDB through the Mongo.Client‘s connect method

// use DB
var db
MongoClient.connect('mongodb://user:123456@ds245228.mlab.com:45228/star-wars-quotes', (err, client) => {
  if (err) return console.log(err)
  db = client.db('star-wars-quotes') // whatever your database name is
  app.listen(3000, () => {
    console.log('listening on 3000') // start server
  })
})

// operation CREATE
app.use(bodyParser.urlencoded({extended: true})) // extract data from the <form> element
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

// operation READ
app.set('view engine', 'ejs') // use template /views/index.ejs 
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray(function(err, result) {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
    })
})

app.use(bodyParser.json())
app.use(express.static('public'))

// operation UPDATE
app.put('/quotes', (req, res) => {
  // Handle put request
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// operation DELETE
app.delete('/quotes', (req, res) => {
  // Handle delete event here
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})
