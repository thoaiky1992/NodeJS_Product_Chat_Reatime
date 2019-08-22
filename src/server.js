// const express   = require('express');
import express from 'express';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import session from './config/session';
import passport from 'passport';
import pem from 'pem';
import https from 'https';
import http from 'http';
import socketio from 'socket.io';
import initSockets from './sockets/index';
import cookieParser from 'cookie-parser';
import configSocketIo from './config/socketio';

const app       = express();
const hostname  = "localhost";
const port      = 3000;
let server = http.createServer(app);
let io = socketio(server);
//connect to MongoDB
connectDB();

//config session
session.config(app);

//config view engine
configViewEngine(app);

//enable post data for request
app.use(bodyParser.urlencoded({extended:true}));

// enable connect flash massage
app.use(connectFlash());
// User cookie parser
app.use(cookieParser());

// config passport js
app.use(passport.initialize());
app.use(passport.session());

// init all routes
initRoutes(app);

// config socketIo
configSocketIo(io,cookieParser,session.sessionStore);

// init all socket
initSockets(io);

// server.listen(port,hostname,()=>{
//     console.log(`starting ${hostname}:${port}`);
// })
server.listen(process.env.PORT);
// cấu hình https ảo
// pem.config({
//     pathOpenSSL: 'C:\\Program Files\\OpenSSL-Win64\\bin\\openssl' // thay đường dẫn đó vào và thêm  \\ openssl
// })
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
// //connect to MongoDB
// connectDB();

// //config session
// session.config(app);

// //config view engine
// configViewEngine(app);

// //enable post data for request
// app.use(bodyParser.urlencoded({extended:true}));

// // enable connect flash massage
// app.use(connectFlash());
// // User cookie parser
// app.use(cookieParser());

// // config passport js
// app.use(passport.initialize());
// app.use(passport.session());

// // init all routes
// initRoutes(app);

// // config socketIo
// configSocketIo(io,cookieParser,session.sessionStore);

// // init all socket
// initSockets(io);
 
//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port,hostname,()=>{
//     console.log(`starting ${hostname}:${port}`);
//     })
// })

