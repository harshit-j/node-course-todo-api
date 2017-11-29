const {ObjectID} = require("mongodb");
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 3133
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
	_id:userOneId,
	email:'asdfsdaf@gmail.com',
	password:'asdfdsafdsf',
	tokens:[{
		token:jwt.sign({
			_id:userOneId.toHexString(),
			access:'auth'
		}, 'abc123').toString(),
		access:'auth'
	}]
},{
	_id:userTwoId,
	email:'asfa@gmil.com',
	password:'safdasfsf'
}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
}

const populateUsers = (done) => {
	User.remove({}).then(() => {
		let user1 = new User(users[0]).save();
		let user2 = new User(users[1]).save();

		return Promise.all([user1,user2])
	}).then(() => done())
}
module.exports = {todos, users, populateTodos, populateUsers}