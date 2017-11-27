const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


let id = "6a1bd66a01f5dc50530a4bbf1";

if(!ObjectID.isValid(id)){
	console.log('sdfsdf')
}// Todo.find({
// 	_id : id //no need to manually convert id in mongoose
// }).then((todos) => {
// 	console.log(todos)
// });

// Todo.findOne({
// 	_id : id //no need to manually convert id in mongoose
// }).then((todo) => {
// 	console.log('Todo '+todo)
// });

// Todo.findById(id).then(todo => {
// 	if(!todo){
// 		return console.log('Id not found')
// 	}
// 	console.log(todo);
// }).catch(e => console.log(e))

id = "6a17f62a7683e1e017427532";
User.findById(id).then(user => {
	if(!user){
		return console.log('User not found')
	}
	console.log(user)
}).catch(e => console.log(e));