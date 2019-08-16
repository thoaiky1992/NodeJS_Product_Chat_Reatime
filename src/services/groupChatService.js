import chatGroupModel from '../models/chatGroupModel';
import userModel from '../models/userModel';;
import _ from 'lodash';
let addNewGroup = (currentuserId,arrayMemberIds,groupChatName) => {
    return new Promise(async(resolve,reject) => {
        try {
            // add current Id to array members
            arrayMemberIds.unshift({userID : `${currentuserId}`});
            arrayMemberIds = _.uniqBy(arrayMemberIds,'userID');
            let newGroupItem = {
                name            : groupChatName,
                userAmount      : arrayMemberIds.length,
                messageAmount   : 0,
                userID          : `${currentuserId}`,
                members         : arrayMemberIds
            }
            let newGroup = await chatGroupModel.createNew(newGroupItem);
            resolve(newGroup);
        } catch (error) {
            reject(error);
        }
    })
}
let addUserToGroupChat = (targetId,groupChatId) => {
    return new Promise(async(resolve,reject) => {
        try {
            let getGroupChat = await chatGroupModel.getChatGroupById(groupChatId);
            let members = [];
            getGroupChat.members.forEach(item => {
                members.push({userID : item.userID});
            })
            members.push({userID : targetId});
            let userAmount = members.length;
            let addUserToGroupChat = await chatGroupModel.addUserToGroupChat(members,groupChatId,userAmount);
            let getNewUserAddToGroup = await userModel.getNormalUserDataById(targetId);
            resolve(getNewUserAddToGroup);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    addNewGroup,
    addUserToGroupChat
}