import express from 'express';
import AuthController from '../controllers/auth.controller';
import HomeController from '../controllers/home.controller';
import {authValid}    from '../validation/index';
import passport from 'passport';
import initPassportLocal from '../controllers/passportController/local';
//init all passport
let router = express.Router();
initPassportLocal();
// all routes
let initRoutes = (app) => {
    router.get('/',HomeController);
    router.get('/login-register',AuthController.loginRegister);
    router.post('/register', authValid.register ,AuthController.postRegister);
    router.get('/verify/:token',AuthController.verifyAccount)
    router.post('/login',passport.authenticate('local',{
        successRedirect : '/',
        failureRedirect : '/login-register',
        successFlash    : true,
        failureFlash    :  true
    }))
    return app.use('/',router);
}
module.exports = initRoutes;

