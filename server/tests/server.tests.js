const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {User} = require('../models/user');
const {Todo} = require('../models/todo');
const {todos, users, populateTodos, populateUsers} = require('./Seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos',() => {
	it('should create a new todo',(done)=>{
		let text = 'test text';
		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res)=>{
			expect(res.body.text).toBe(text);
		})
		.end((err,res) =>{
			if(err){
				return done(err);
			}

			Todo.find({text}).then((todos) => {
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done()
			})
			.catch((e)=> done(e))
		})
	});

	it('should not create todo with invalid body data',(done)=>{
		request(app)
		.post('/todos')
		.send({})
		.expect(404)
		.end((err,res) =>{
			if(err){
				return done(err)
			}

			Todo.find().then((todos)=> {
				expect(todos.length).toBe(2);
				done()
			})
			.catch((e) => done(e))
		})
	})
})

describe('GET /todos', () => {
	it('should get all todos', (done) =>{
		request(app)
		.get('/todos')
		.expect(200)
		.expect(res=>{
			expect(res.body.todos.length).toBe(2)
		})
		.end(done)
	})
})

describe('GET /todos/:id', ()=>{
	it('should return todo doc',(done)=>{
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done)
	});

	it('should return a 404 if todo not found',(done)=>{
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done)
	});

	it('should return a 404 for non-object ids',(done)=>{
		request(app)
			.get(`/todos/;kl;k;lk;lk;l`)
			.expect(404)
			.end(done)
	});	
})

describe('DELETE /todos/:id', ()=>{
	it('should remove a todo',(done)=>{
		const hexId = todos[0]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end((err, res) => {
				if(err){
					return done(err)
				}

				Todo.findById(hexId).then(todo =>{
					expect(todo).toNotExist();
					done()

				}).catch(e => done(e))
			})
	});

	it('should return a 404 if todo not found',(done)=>{
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done)
	});

	it('should return a 404 for non-object ids',(done)=>{
		request(app)
			.delete(`/todos/;kl;k;lk;lk;l`)
			.expect(404)
			.end(done)
	});

});

describe('PATCH /todos/:id',() => {
	it('should update the todo',(done) => {
		const id = todos[0]._id.toHexString();
		const body = {
			text : 'modified first todo',
			completed: true
		}
		request(app)
			.patch(`/todos/${id}`)
			.send(body)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(body.text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done)
	});

	it('should clear completedAt when todo is not completed',(done) => {
		const id = todos[1]._id.toHexString();
		const body = {
			text : 'modified 2nd todo',
			completed: false,
		}
		request(app)
			.patch(`/todos/${id}`)
			.send(body)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(body.text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done)});
});

describe('GET /users/me',() => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect(res => {
				expect(res.body).toEqual({})
			})
			.end(done)
	});
});

describe('POST /users', ()=>{
	it('should create a user',(done) => {
		let email = 'asdf@fdsa.com',
		password = '123456';

		request(app)
			.post('/users')
			.send({email,password})
			.expect(200)
			.expect(res => {
				expect(res.header['x-auth']).toExist();
				expect(res.body.email).toBe(email);
				expect(res.body._id).toExist();
			})
			.end((err) => {
				if(err) return done(err);

				User.findOne({email}).then((user) =>{
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done()
				})
			})
	});

	it('should return validation errors if request invalid',(done) => {
		request(app)
			.post('/users')
			.send({email:'dsfads',password:'123'})
			.expect(400)
			.end(done)
	});
	it('should not create user if already in use',(done) => {
		request(app)
			.post('/users')
			.send({email:users[0].email,password:'1233211'})
			.expect(400)
			.end(done)
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', done => {
		request(app)
			.post('/users/login')
			.send({
				email:users[1].email,
				password:users[1].password
			})
			.expect(200)
			.expect(res => {
				expect(res.header['x-auth']).toExist()
			})
			.end((err,res) => {
				if(err) return done(err)
				User.findById(users[1]._id).then(user => {
					expect(user.tokens[0]).toInclude({
						access:'auth',
						token:res.header['x-auth']
					});
					done();
				}).catch(e => done(e))
			})
	});

	it('should reject invalid login',done => {
		request(app)
			.post('/users/login')
			.send({
				email:users[1].email,
				password:'njlkkjnn'
			})
			.expect(400)
			.expect(res => {
				expect(res.header['x-auth']).toNotExist()
			})
			.end((err,res) => {
				if(err) return done(err)
				User.findById(users[1]._id).then(user => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch(e => done(e))
			})
	})
})