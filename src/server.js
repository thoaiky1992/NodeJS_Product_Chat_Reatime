// const express   = require('express');
import express from 'express';
import connectDB from './config/connectDB';

//connect to MongoDB
connectDB();

const app       = express();
const hostname  = "localhost";
const port      = 4000;

app.get('/',(req,res) => {
    res.send("nodejs chat realtime") ;
})

app.listen(port,hostname,()=>{
    console.log(`starting ${hostname}:${port}`);

})