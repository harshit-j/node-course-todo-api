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

UserSchema.statics.findByToken = function(token){
	let User = this;
	let decoded;

	try{
		decoded = jwt.verify(token,'abc123')
	}catch(e){
		return Promise.reject()
	}

	return User.findOne({
		'_id':decoded._id,
		"tokens.token":token, //To query a nested document in collection, use dot notation
		"tokens.access":'auth'
	});

}
let User = mongoose.model("User", UserSchema);

module.exports = { User }