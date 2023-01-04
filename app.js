require('dotenv').config();

const express=require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app=express();
const port=process.env.PORT;

app.use(bodyParser({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'))



app.listen(port,()=>{
    console.log("Server running on",port);
})