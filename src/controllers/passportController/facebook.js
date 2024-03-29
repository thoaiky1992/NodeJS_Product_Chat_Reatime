import passport from 'passport';
import passportFacebook from 'passport-facebook';
import userModel from '../../models/userModel';
import ChatGroupModel from '../../models/chatGroupModel';
import {transErrors,transSuccess} from '../../../lang/vi';
let facebookStrategy = passportFacebook.Strategy;	 

let FbAppID = '1325164364305202';
let FBSecret = 'e2971b387746ea4fe9d5fd38bd02261e';
let FbCallbackURL = 'https://chat-mini-online.herokuapp.com/auth/facebook/callback';
let initPassportFacebook = () => {
	passport.use(new facebookStrategy({
        clientID            : FbAppID,
        clientSecret        : FBSecret,
        callbackURL         : FbCallbackURL,
        profileFields       : ['email','gender','displayName','photos'],
        passReqToCallback   : true // truyền request sang hàm callback kế bế bên,
	} , async (req,accessToken,refreshToken,profile,done) => {
		try {
            let user = await userModel.findByFacebookUid(profile.id);
            if(user){
                return done(null,user,req.flash('success',transSuccess.loginSuccess(user.username)))
            }
            // console.log(profile)
			let newUserItem = {
                username    : profile.displayName,
                gender      : profile.gender,
                local       :{isActive:true},
                facebook    : {
                    uid     : profile.id,
                    token   : accessToken,
                    email   : profile.emails[0].value
                }
            }
            let NewUser = await userModel.createNew(newUserItem);
            return done(null,NewUser,req.flash('success',transSuccess.loginSuccess(NewUser.username)))
		} catch (error) {
			return done(null,false,req.flash('errors',transErrors.server_error))
		}
	}));
	passport.serializeUser((user,done) => { //  lưu  user vào session
		done(null,user._id);
	});
	passport.deserializeUser(async(id,done) => {
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
module.exports = initPassportFacebook;