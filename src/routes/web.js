import express from 'express';
import AuthController from '../controllers/auth.controller';
import HomeController from '../controllers/home.controller';
import UserController from '../controllers/userController';
import {authValid}    from '../validation/index';
import passport from 'passport';
import initPassportLocal from '../controllers/passportController/local';
import initPassportFacebook from '../controllers/passportController/facebook';
import initPassportGoogle from '../controllers/passportController/google';
//init all passport
let router = express.Router();
initPassportLocal();
initPassportFacebook();
initPassportGoogle();
// all routes
let initRoutes = (app) => {
    router.get('/', AuthController.checkLoggedIn ,HomeController);
    router.get('/logout', AuthController.checkLoggedIn, AuthController.getLogout);


    router.get('/login-register', AuthController.checkLoggedOut,AuthController.loginRegister);
    router.post('/register', AuthController.checkLoggedOut,authValid.register ,AuthController.postRegister);
    router.get('/verify/:token',AuthController.checkLoggedOut,AuthController.verifyAccount)
    router.post('/login',AuthController.checkLoggedOut,passport.authenticate('local',{
        successRedirect : '/',
        failureRedirect : '/login-register',
        successFlash    : true,
        failureFlash    :  true
    }));
    router.get('/auth/facebook',AuthController.checkLoggedOut,passport.authenticate('facebook',{scope:['email']}));
    router.get('/auth/facebook/callback',AuthController.checkLoggedOut,passport.authenticate('facebook',{
        successRedirect : '/',
        failureRedirect : '/login-register'
    }));
    router.get('/auth/google',AuthController.checkLoggedOut,passport.authenticate('google',{scope:['email']}));
    router.get('/auth/google/callback',AuthController.checkLoggedOut,passport.authenticate('google',{
        successRedirect : '/',
        failureRedirect : '/login-register'
    }));
    router.put('/user/update-avatar',AuthController.checkLoggedIn,UserController.updateAvatar);
    return app.use('/',router);
}
module.exports = initRoutes;

