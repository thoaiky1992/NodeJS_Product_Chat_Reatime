import userModel from '../models/userModel';
import {transErrors,transSuccess,transMail} from '../../lang/vi';
import sendMail from '../config/mailer';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
let saltRounds = 7 ;
let register =  (email,gender,password,protocol,host) => {
    return new Promise(async(resolve,reject) => {
        let userByEmail = await userModel.findByEmail(email);
        if(userByEmail){
            if(!userByEmail.local.isActive){
                return reject(transErrors.account_not_active);
            }
            if(userByEmail.deleteAt != null){
                return reject(transErrors.account_removed);
            }
            return reject(transErrors.account_in_use);
        }
        let salt = bcrypt.genSaltSync(saltRounds);
        let userItem = {
            username : email.split('@')[0],
            gender : gender,
            local : {
                email : email , 
                password : bcrypt.hashSync(password,salt),
                verifyToken : uuidv4()
            }
        };
        let user = await userModel.createNew(userItem);
        //send Mail
        // linkVerify : http://localhost/verify/aksrbdas2348sdfh235sfj35
        let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
        sendMail(email,transMail.subject,transMail.template(linkVerify))
            .then(success => {
                resolve(transSuccess.userCreated(user.local.email));
            })
            .catch(async (error) => {
                //remove user
                await userModel.removeById(user._id)
                reject(transMail.send_failed);
            })
    })
};
let verifyAccount = (token) => {
    return new Promise(async(resolve,reject) => {
        let userByToken = await userModel.findByToken(token);
        if(!userByToken){
            return reject(transErrors.token_undefined);
        }
        await userModel.verify(token);
        resolve(transSuccess.account_actived)
    })
}

module.exports = {
    register,
    verifyAccount
}