import express from 'express';
import AuthController from '../controllers/auth.controller';
import HomeController from '../controllers/home.controller';
let router = express.Router();

let initRoutes = (app) => {
    router.get('/',HomeController);
    router.get('/login-register',AuthController.loginRegister);

    return app.use('/',router);
}
module.exports = initRoutes;

