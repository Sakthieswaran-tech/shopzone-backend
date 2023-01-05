require('dotenv').config();

const express=require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const userRoutes=require('./routes/users');

const app=express();
const port=process.env.PORT;



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'))

app.use('/users',userRoutes);

app.use((req,res,next)=>{
    const error=new Error("Not found page");
    error.status=500;
    next(error);
});

app.use((error,req,res)=>{
    res.status(error.status || 500).json({
        error:{
            message:error.message
        }
    });
});



app.listen(port,()=>{
    console.log("Server running on",port);
})