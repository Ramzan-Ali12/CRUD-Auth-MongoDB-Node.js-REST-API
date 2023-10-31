const mongoose = require('mongoose'); 
const imgSchema={
    name:{
        type:String,
        require:true
    },
    image:{
        data:Buffer,
        contentType:String
    }
}

// Export model
const imgModel=mongoose.model("image",imgSchema)
module.exports=imgModel;