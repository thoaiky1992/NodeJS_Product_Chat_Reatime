import contactModel from './../models/contactModel';
import userModel from './../models/userModel';
import chatGroupModel from './../models/chatGroupModel';
import messageModel from './../models/messageModel';
import _ from 'lodash';
const LIMIT_CONVERSATIONS = 10;
const LIMIT_MESSAGES = 30; 
/**
 * get all conversations 
 * @param {string} currentUserId 
 */
let letAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve,reject) => {
        try {
            let contacts = await contactModel.getContacts(currentUserId,LIMIT_CONVERSATIONS);
            let userConversationstPromise = contacts.map( async (contact) => {
                if(contact.contactID == currentUserId){
                    let getUserContact =  await userModel.getNormalUserDataById(contact.userID);
                    getUserContact.updateAt = contact.updateAt;
                    return getUserContact;
                }
                else{
                    let getUserContact = await userModel.getNormalUserDataById(contact.contactID);
                    getUserContact.updateAt = contact.updateAt;
                    return getUserContact;
                }
            });
            let userConversations =  await Promise.all(userConversationstPromise);
            let groupConversations = await chatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS);
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations , (item) => {
                return -item.updateAt;
            })
            // get message to apply in screen chat
            let allConversationWidthMessagePromise = allConversations.map( async (conversation) => {
                conversation = conversation.toObject();
                if(conversation.members){
                    let getMessage = await  messageModel.model.getMessageInGroup(conversation._id,LIMIT_MESSAGES);
                    conversation.messages = getMessage;
                }else{
                    let getMessage = await  messageModel.model.getMessageInPersonal(currentUserId,conversation._id,LIMIT_MESSAGES);
                    conversation.messages = getMessage;
                }
                return conversation;
            })
            let allConversationWithMessage = await Promise.all(allConversationWidthMessagePromise);
            // sort By updateAt DESC
            allConversationWithMessage = _.sortBy(allConversationWithMessage,(item) => {
                return -item.updateAt;
            })
            resolve({
                allConversationWithMessage : allConversationWithMessage
            });
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    letAllConversationItems
};