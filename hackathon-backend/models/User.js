const mongoose=require(`mongoose`)
const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
   team:{
    type:mongoose.Schema.Types.ObjectId,
   ref:'Team',
   default:null,

   }
})
module.exports=mongoose.model("User",userSchema);