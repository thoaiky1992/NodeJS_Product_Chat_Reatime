import express from 'express';
import AuthController from '../controllers/auth.controller';
import HomeController from '../controllers/home.controller';
import {authValid}    from '../validation/index';
import passport from 'passport';
import initPassportLocal from '../controllers/passportController/local';
import initPassportFacebook from '../controllers/passportController/facebook';
//init all passport
let router = express.Router();
initPassportLocal();
initPassportFacebook();
// all routes
let initRoutes = (app) => {
    router.get('/', AuthController.checkLoggedIn ,HomeController);

    router.get('/login-register', AuthController.checkLoggedOut,AuthController.loginRegister);
    router.post('/register', AuthController.checkLoggedOut,authValid.register ,AuthController.postRegister);
    router.get('/verify/:token',AuthController.checkLoggedOut,AuthController.verifyAccount)
    router.post('/login',AuthController.checkLoggedOut,passport.authenticate('local',{
        successRedirect : '/',
        failureRedirect : '/login-register',
        successFlash    : true,
        failureFlash    :  true
    }))
    router.get('/logout', AuthController.checkLoggedIn, AuthController.getLogout);

    router.get('/auth/facebook',passport.authenticate('facebook',{scope:['email']}));
    router.get('/auth/facebook/callback',passport.authenticate('facebook',{
        successRedirect : '/',
        failureRedirect : '/login-register'
    }))
    return app.use('/',router);
}
module.exports = initRoutes;

