const express = require("express");
const helmet = require("helmet");
const mongoose  = require("mongoose");
const morgan = require("morgan");
const dotenv = require('dotenv');

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')


const app = express();

dotenv.config()

//establish connection with
mongoose.connect(process.env.MONGO_URL, 
    {useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true})
.then(()=> console.log("Connected"))
.catch(err =>console.log(err))

    



//middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)



app.get('/users',(req,res)=>{
    res.send("welcome to users")
})

//backend
const PORT = 8800
app.listen(PORT,()=>{
    console.log("Backend server is ready")
})