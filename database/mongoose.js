const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/taskmangerdb')

.then(()=>{
    console.log("db connected")
})
.catch((error)=>
{
    console.log(error)
});
module.exports =
mongoose;