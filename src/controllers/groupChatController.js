import {groupChat} from '../services/index';
let addNewGroupChat = async (req,res) => {
    try {
        let currentUserId = req.user._id;
        let arrayMemberIds = req.body.arrayIds;
        let groupChatName = req.body.groupChatName;

        let newGroupChat = await groupChat.addNewGroup(currentUserId,arrayMemberIds,groupChatName);
        return res.status(200).send({groupChat :  newGroupChat});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let addUserToGroupChat = async (req,res) => {
    try {
        let targetId = req.query.targetId;
        let groupChatId = req.query.groupChatId;
        let addUserToGroupChat = await groupChat.addUserToGroupChat(targetId,groupChatId);
        return res.status(200).send(addUserToGroupChat);
    } catch (error) {
        return res.status(500).send(error);
    }
}
module.exports = {
    addNewGroupChat,
    addUserToGroupChat
}