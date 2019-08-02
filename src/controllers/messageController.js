import { message } from './../services/index';
import { transErrors , transSuccess} from '../../lang/vi';
import { app } from '../config/app';
import multer from 'multer';
import fsExtra from 'fs-extra';
let StorageImageChat = multer.diskStorage({
    destination : (req,file,callback) => {
        callback(null,app.image_message_directory);
    },
    filename : (req,file,callback) => {
        let math = app.image_message_type;
        if(math.indexOf(file.mimetype) === -1){
            return callback(transErrors.image_message_type,null)
        }
        let image_message_Name = `${file.originalname}`;
        callback(null,image_message_Name);
    }
})
let imageMessageUploadFile = multer({
    storage : StorageImageChat,
    limits : {fileSize : app.image_message_limit_size}
}).single("my-image-chat");
let addNewImage = (req,res) => {
    imageMessageUploadFile(req,res, async (error) => {
        if(error){
            if(error.message){
                return res.status(500).send(transErrors.image_message_size);
            }
            return res.status(500).send(error);
        }
        try {
            let sender = {
                id : req.user._id,
                name : req.user.username,
                avatar : req.user.avatar
            }
            let receiverId = req.body.uid ; 
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;
            let newMessage = await message.addNewImage(sender,receiverId,messageVal,isChatGroup);
            //remove image , because this image is saved to mongodb
            await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`)
            return res.status(200).send({message:newMessage});
        } catch (error) {
            res.status(500).send(error);
        }
    });
    
}
let addNewTextEmoji = async (req,res) => {
    try {
        let sender = {
            id : req.user._id,
            name : req.user.username,
            avatar : req.user.avatar
        }
        let receiverId = req.body.uid ; 
        let messageVal = req.body.messageVal;
        let isChatGroup = req.body.isChatGroup;
        let  newMessage = await message.addNewTextEmoji(sender,receiverId,messageVal,isChatGroup);
        return res.status(200).send({message:newMessage});
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    addNewTextEmoji,
    addNewImage
}