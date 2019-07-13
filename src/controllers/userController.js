import multer from 'multer';
import {validationResult} from 'express-validator/check';
import { app } from '../config/app';
import dateTimeCurrent from '../../lang/dateTimeCurrent';
import { transErrors , transSuccess} from '../../lang/vi';
import uuidv4 from 'uuid/v4';
import {user} from '../services/index';
import fsExtra from 'fs-extra';
let StorageAvatar = multer.diskStorage({
    destination : (req,file,callback) => {
        callback(null,app.avatar_directory);
    },
    filename : (req,file,callback) => {
        let math = app.avatar_type;
        if(math.indexOf(file.mimetype) === -1){
            return callback(transErrors.avatar_type,null)
        }
        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null,avatarName);
    }
})
let avatarUploadFile = multer({
    storage : StorageAvatar,
    limits : {fileSize : app.avatar_limit_size}
}).single("avatar");
// update avatar
let updateAvatar = (req,res) => {
    avatarUploadFile(req,res, async (error) => {
        if(error){
            console.log(error)
            if(error.message){
                return res.status(500).send(transErrors.avatar_size);
            }
            return res.status(500).send(transErrors.avatar_type);
        }
        try {
            let updateUserItem = {
                avatar : req.file.filename,
                updateAt : dateTimeCurrent("Asia/Ho_Chi_Minh")
            }
            // update User
            let userUpdate = await user.updateUser(req.user._id,updateUserItem);
            // xoá avatar cũ
            await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
            let result = {
                message : transSuccess.user_info_or_avatar_updated,
                imageSrc : `/images/users/${req.file.filename}`
            }
            return res.status(200).send(result)
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    });
}
// update info
let updateInfo = async (req,res) => {
    let errorArr   = [];
    const errorValidation = validationResult(req);
    if(!errorValidation.isEmpty()){
        let errors = Object.values(errorValidation.mapped()); // Object.values lấy tất cả các value bỏ vào mảng 
        errors.forEach(item => {
            errorArr.push(item.msg);
        })
        return res.status(500).send(errorArr);
    }
    try {
        let updateUserItem = req.body;
        await user.updateUser(req.user._id,updateUserItem);
        let result = {
            message : transSuccess.user_info_or_avatar_updated
        }
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
module.exports = {
    updateAvatar,
    updateInfo
}