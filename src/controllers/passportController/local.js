import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../../models/userModel';
import ChatGroupModel from '../../models/chatGroupModel';
import {transErrors,transSuccess} from '../../../lang/vi';
let localStrategy = passportLocal.Strategy;	 

let initPassportLocal = () => {
	passport.use(new localStrategy({
		usernameField : "email",
		passwordField : "password",
		passReqToCallback : true // truyền request sang hàm callback kế bế bên
	} , async (req,email,password,done) => {
		try {
			let user = await userModel.findByEmail(email);
			if(!user){
				return done(null,false,req.flash('errors',transErrors.login_failed));
			}
			if(!user.local.isActive){
				return done(null,false,req.flash('errors',transErrors.account_not_active));
			}
			let checkPassword = await user.comparePassword(password);
			if(!checkPassword){
				return done(null,false,req.flash('errors',transErrors.login_failed)); 
			}
			return done(null,user,req.flash('success',transSuccess.loginSuccess(email)))
		} catch (error) {
			return done(null,false,req.flash('errors',transErrors.server_error))
		}
	}));
	passport.serializeUser((user,done) => { //  lưu  user vào session
		done(null,user._id);
	});
	passport.deserializeUser(async (id,done) => {
		try {
			let user = await userModel.findUserByIdForSessionToUse(id);
			let chatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);
			user = user.toObject();
			user.chatGroupIds = chatGroupIds;
			return done(null,user);
		} catch (error) {
			return done(error,null);
		}
	})
}
module.exports = initPassportLocal;