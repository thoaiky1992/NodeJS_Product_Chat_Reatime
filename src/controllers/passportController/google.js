import passport from 'passport';
import passportGoogle from 'passport-google-oauth';
import userModel from '../../models/userModel';
import {transErrors,transSuccess} from '../../../lang/vi';
let GoogleStrategy = passportGoogle.OAuth2Strategy;	 

let GGAppID = '29711674374-gatujvs3b6882odcnoh47s8deibq1mdh.apps.googleusercontent.com';
let GGSecret = '5BoSA5n1xBs6Q-6xA-gp98FS';
let GGCallbackURL = 'https://localhost:3000/auth/google/callback';
let initPassportGoogle = () => {
	passport.use(new GoogleStrategy({
        clientID            : GGAppID,
        clientSecret        : GGSecret,
        callbackURL         : GGCallbackURL,
        profileFields       : ['email','gender','displayName','photos'],
        passReqToCallback   : true // truyền request sang hàm callback kế bế bên,
	} , async (req,accessToken,refreshToken,profile,done) => {
		try {
            let user = await userModel.findByGoogleUid(profile.id);
            if(user){
                return done(null,user,req.flash('success',transSuccess.loginSuccess(profile.emails[0].value)))
            }
            console.log(profile)
			let newUserItem = {
                username    : profile.displayName,
                gender      : profile.gender,
                local       :{isActive:true},
                google      : {
                    uid     : profile.id,
                    token   : accessToken,
                    email   : profile.emails[0].value
                }
            }
            let NewUser = await userModel.createNew(newUserItem);
            return done(null,NewUser,req.flash('success',transSuccess.loginSuccess(NewUser.username)))
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
module.exports = initPassportGoogle;