import { message } from './../services/index';
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
    addNewTextEmoji
}