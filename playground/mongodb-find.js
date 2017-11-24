const {MongoClient, ObjectID} = require('mongodb');
let obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
    	return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');


    // db.collection('Todos').find({
    // 	_id: new ObjectID('5a17c57dbbd86e796b23c069')
    // }).toArray().then((docs) =>{
    // 	console.log('Todos');
    // 	console.log(docs);
    // }, err => {

    // })

    // db.collection('Todos').find().count().then((count) =>{
    // 	console.log(count);
    // }, err => {

    // })

    db.collection('Users').find({name:'abc'}).toArray().then((docs)=>{
    	console.log(docs)
    })
    db.close();
});