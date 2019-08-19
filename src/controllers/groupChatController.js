import {groupChat} from '../services/index';
import ejs from 'ejs';
import {promisify} from 'util';
import { bufferToBase64} from '../helpers/clientHelper';
import _ from 'lodash';
// Make ejs function renderFile available with async/await
const renderFile = promisify(ejs.renderFile).bind(ejs);
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
        let allMessageGroup = await groupChat.allConversationWithMessage(groupChatId);
        allMessageGroup = _.reverse(allMessageGroup);
        let rightSide = await renderFile("src/views/main/detailGroup/sections/rightSide.ejs",{
            allMessageGroup:allMessageGroup,
            groupChatId:groupChatId,
            bufferToBase64:bufferToBase64,
            user : req.user
        });
        return res.status(200).send({addUserToGroupChat:addUserToGroupChat,rightSide:rightSide});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let leaveGroup = async (req,res) => {
    try {
        let groupChatId = req.query.groupChatId ;
        let currentUserId = req.user._id;
        let leaveGroup = await groupChat.leaveGroup(currentUserId,groupChatId);
        return res.status(200).send(leaveGroup);
    } catch (error) {
        return res.status(500).send(error);
    }
}
module.exports = {
    addNewGroupChat,
    addUserToGroupChat,
    leaveGroup
}