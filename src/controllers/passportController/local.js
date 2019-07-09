import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../../models/userModel';
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
			console.log(error);
			return done(null,false,req.flash('errors',transErrors.server_error))
		}
	}));
	passport.serializeUser((user,done) => { //  lưu  user vào session
		done(null,user._id);
	});
	passport.deserializeUser((id,done) => {
		userModel.findUserById(id)
		.then(user => {
			return done(null,user);
		})
		.catch(error => {
			return done(error,null);
		})
	})
}
module.exports = initPassportLocal;