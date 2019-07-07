import userModel from '../models/userModel';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
let saltRounds = 7 ;
let register = async (email,gender,password) => {
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

}
module.exports = {
    register
}