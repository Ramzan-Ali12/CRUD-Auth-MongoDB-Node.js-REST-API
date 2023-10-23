
const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    gender:{
        type:String,
    },
    status:{
        type:String,
    }
});

//Export the model
const Userdb= mongoose.model('userdb', userSchema);
module.exports=Userdb;