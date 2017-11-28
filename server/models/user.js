const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');
const jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
	email: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        unique: true,
        validate:{
        	validator: validator.isEmail,
        	message: '{VALUE} is not a valid email'
        }
    },
    password:{
    	type:String,
    	required: true,
    	minlength: 6,
    },
    tokens:[{
    	access:{
    		type:String,
    		required:true
    	},
    	token:{
			type:String,
    		required:true
    	}
    }]
});

UserSchema.methods.toJSON = function(){
	let user = this;
	let userObject = user.toObject();
	return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken = function(){
	let user = this;
	let access = 'auth';
	let token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
	user.tokens.push({access,token});
	return user.save().then(()=>{
		return token
	});
}
let User = mongoose.model("User", UserSchema);

// let newUser = new User({
// 	email:"   a@   "
// });

// newUser.save().then((doc)=>{
// 	console.log(`saved User: ${doc}`)
// },(e)=>{
// 	console.log(e)
// })

module.exports = { User }