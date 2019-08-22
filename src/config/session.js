import session from 'express-session';
import connectMongo from 'connect-mongo';
let DB_CONNECTION   = 'mongodb';
let DB_HOST         = 'localhost';
let DB_PORT         = '27017';
let DB_NAME         = 'awesome_chat';
let DB_USERNAME     = '';
let DB_PASSWORD     = '';

let mongoStore = connectMongo(session);
/**
 * lưu session vào mongodb
 */
let sessionStore = new mongoStore({
    // url :  `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    url : `mongodb+srv://legendstrange:776041164@cluster0-x39q3.mongodb.net/awesome_chat`,
    autoReconnect : true,
    // autoRemove : 'native'
})
let config = (app) => {
    app.use(session({
        key:'express.sid',
        secret : 'mySecret',
        store : sessionStore,
        resave : true,
        saveUninitialized : false,
        coookie : {
            maxAge : 1000 * 60 * 60 * 24 // 86400000 seconds =  1 day
        }
    }))
}
module.exports = {
    config,
    sessionStore
};