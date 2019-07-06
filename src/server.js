// const express   = require('express');
import express from 'express';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
const app       = express();
const hostname  = "localhost";
const port      = 4000;

//connect to MongoDB
connectDB();
//config view engine
configViewEngine(app);
// init all routes
initRoutes(app);

app.listen(port,hostname,()=>{
    console.log(`starting ${hostname}:${port}`);
})