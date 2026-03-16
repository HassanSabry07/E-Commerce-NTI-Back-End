const mongoose=require('mongoose');

const dbConnect= async()=>{
try{
  const conn = await mongoose.connect(process.env.MONGO_URI);
   console.log(`database connected: ${conn.connection.host}`);
}
catch(err){
console.log(`database connection faild: ${err.message}`);
process.exit(1);
}
}

module.exports = dbConnect;
