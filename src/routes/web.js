import express from 'express';
import AuthController from '../controllers/auth.controller';
import HomeController from '../controllers/home.controller';
import UserController from '../controllers/userController';
import ContactController from '../controllers/contactController';
import groupChatController from '../controllers/groupChatController';
import MessageController from '../controllers/messageController';
import notificationController from '../controllers/notificationController';
import {authValid,userValid}    from '../validation/index';
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
    router.put('/user/update-info',AuthController.checkLoggedIn,userValid.updateInfo ,UserController.updateInfo);
    router.put('/user/update-password',AuthController.checkLoggedIn,userValid.updatePassword, UserController.updatePassword)
    
    router.get('/contact/find-users/:keyword',AuthController.checkLoggedIn,ContactController.findUsersContact);
    router.post('/contact/add-new',AuthController.checkLoggedIn,ContactController.addNew);
    router.delete('/contact/remove-request-contact-sent',AuthController.checkLoggedIn,ContactController.removeRequestContactSent);
    router.delete('/contact/remove-request-contact-received',AuthController.checkLoggedIn,ContactController.removeRequestContactReceived);
    router.delete('/contact/remove-contact',AuthController.checkLoggedIn,ContactController.removeContact);
    router.put('/contact/approve-request-contact-received',AuthController.checkLoggedIn,ContactController.approveRequestContactReceived);
    router.get('/contact/read-more-contacts',AuthController.checkLoggedIn,ContactController.readMoreContacts);
    router.get('/contact/read-more-contacts-sent',AuthController.checkLoggedIn,ContactController.readMoreContactsSent);
    router.get('/contact/read-more-contacts-recieved',AuthController.checkLoggedIn,ContactController.readMoreContactsRecived);
    router.get('/contact/search-friends/:keyword',AuthController.checkLoggedIn,ContactController.searchFriends)
    router.get('/contact/search-conversations',AuthController.checkLoggedIn,ContactController.searchConversations);
    router.get('/contact/user-in-group',AuthController.checkLoggedIn,ContactController.userInGroup);
    router.get('/contact/check-friend',AuthController.checkLoggedIn,ContactController.checkFriend);
    router.get('/contact/search-user-not-in-group',AuthController.checkLoggedIn,ContactController.searchUserNotInGroup);
    

    router.get('/notification/read-more',AuthController.checkLoggedIn,notificationController.readMore);
    router.put('/notification/mark-notify-read',AuthController.checkLoggedIn,notificationController.markNotificationAsRead);

    router.post('/message/add-new-text-emoji',AuthController.checkLoggedIn,MessageController.addNewTextEmoji);
    router.post('/message/add-new-image',AuthController.checkLoggedIn,MessageController.addNewImage);
    router.post('/message/add-new-attachment',AuthController.checkLoggedIn,MessageController.addNewAttachment);
    router.get('/message/read-more-all-chat',AuthController.checkLoggedIn,MessageController.readMoreAllChat);
    router.get('/message/read-more',AuthController.checkLoggedIn,MessageController.readMore);

    router.post('/group-chat/add-new',AuthController.checkLoggedIn,groupChatController.addNewGroupChat);
    router.get('/group-chat/add-user-to-group-chat',AuthController.checkLoggedIn,groupChatController.addUserToGroupChat);
    
    return app.use('/',router);
}
module.exports = initRoutes;

