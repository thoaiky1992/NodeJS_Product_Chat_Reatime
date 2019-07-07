import express from 'express';
import AuthController from '../controllers/auth.controller';
import HomeController from '../controllers/home.controller';
import {authValid}    from '../validation/index';
let router = express.Router();

let initRoutes = (app) => {
    router.get('/',HomeController);
    router.get('/login-register',AuthController.loginRegister);
    router.post('/register', authValid.register ,AuthController.postRegister);

    return app.use('/',router);
}
module.exports = initRoutes;

