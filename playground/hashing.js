const {SHA256} = require('crypto-js');
let message = "I am user 3";
var hash = SHA256(message).toString();
console.log(`Message:${hash}`);