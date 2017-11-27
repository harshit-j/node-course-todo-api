const {ObjectID} = require('mongodb');
debugger;
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then(result => {
// 	console.log(result)
// });

//Todo.findOneAndRemove
//Todo.findByIdAndRemove

Todo.findOneAndRemove({_id:'5a1bfa7fcc5525004ca5d842'}).then(result => {
	console.log(result)
});

Todo.findByIdAndRemove('5a1bfa7fcc5525004ca5d842').then(result => {
	console.log(result)
});