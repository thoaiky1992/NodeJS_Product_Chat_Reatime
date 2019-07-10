// const express   = require('express');
import express from 'express';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import configSession from './config/session';
import passport from 'passport';
import pem from 'pem';
import https from 'https';
const app       = express();
const hostname  = "localhost";
const port      = 3000;

// cấu hình https ảo
// pem.config({
//     pathOpenSSL: 'C:\\Program Files\\OpenSSL-Win64\\bin\\openssl'
// })
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
//     //connect to MongoDB
//     connectDB();

//     //config session
//     configSession(app);

//     //config view engine
//     configViewEngine(app);

//     //enable post data for request
//     app.use(bodyParser.urlencoded({extended:true}));

//     // enable connect flash massage
//     app.use(connectFlash());

//     // config passport js
//     app.use(passport.initialize());
//     app.use(passport.session());

//     // init all routes
//     initRoutes(app);
 
//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port,hostname,()=>{
//     console.log(`starting ${hostname}:${port}`);
//     })
// })

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

// config passport js
app.use(passport.initialize());
app.use(passport.session());

// init all routes
initRoutes(app);

app.listen(port,hostname,()=>{
    console.log(`starting ${hostname}:${port}`);
})