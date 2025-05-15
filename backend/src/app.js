const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();
const port=process.env.PORT | 4000
const app=express();
const cookieParser = require("cookie-parser");

app.use(cors({
    origin: "http://localhost:5173",
    
    credentials: true,
}));

app.use(express.json());

app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use('/',require('./routes/auth'));
app.use('/',require('./routes/doctorAuth'));
app.use('/',require('./routes/appointmentroute'))
app.use('/',require('./routes/payment'));



mongoose.connect(process.env.MONGODB_URL).
then(()=>{
    console.log("database connect successfully")
    app.listen(port,()=>{
        console.log(`App listen on ${port}`)
    });
}).catch((err)=>{
    console.error("database connection error",err);

})