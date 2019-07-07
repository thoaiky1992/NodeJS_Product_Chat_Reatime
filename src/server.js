// const express   = require('express');
import express from 'express';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import configSession from './config/session';
const app       = express();
const hostname  = "localhost";
const port      = 3000;

//connect to MongoDB
connectDB();

//config session
configSession(app);

//config view engine
configViewEngine(app);

//enable post data for request
app.use(bodyParser.urlencoded({extended:true}));

// enable connect flash massage
app.use(connectFlash());

// init all routes
initRoutes(app);

app.listen(port,hostname,()=>{
    console.log(`starting ${hostname}:${port}`);
})