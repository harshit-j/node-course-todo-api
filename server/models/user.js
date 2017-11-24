let mongoose = require('mongoose');

let User = mongoose.model("User",{
	email:{
		type:String,
		required:true,
		minlength:3,
		trim:true
	}
});

// let newUser = new User({
// 	email:"   a@   "
// });

// newUser.save().then((doc)=>{
// 	console.log(`saved User: ${doc}`)
// },(e)=>{
// 	console.log(e)
// })

module.exports = {User}