const {MongoClient, ObjectID} = require('mongodb');
let obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
    	return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').deleteMany({text:'Eat Lunch'}).then((result)=>{
    //     console.log(result)
    // })

    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
    //     console.log(result)
    // })

    db.collection('Users').findOneAndDelete({_id:ObjectID("5a17cef574ece17fd3e5a4f2")}).then((result)=>{
        console.log(result)
    });
    db.collection('Users').deleteMany({name:'abc'}).then((result)=>{
        console.log(result)
    })

    db.close();
});