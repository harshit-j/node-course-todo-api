const {MongoClient, ObjectID} = require('mongodb');
let obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
    	return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    db.collection('Users').findOneAndUpdate({_id:ObjectID("5a17d23896797facb759168a")},{
        $set:{
            name:'ppp',
            completed:true
        },
        $inc:{
            age:10
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result)
    })

    db.close();
});