import contactModel from './../models/contactModel';
import userModel from './../models/userModel';
import chatGroupModel from './../models/chatGroupModel';
import _ from 'lodash';
const LIMIT_CONVERSATIONS = 10;
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
                    getUserContact.createAt = contact.createAt;
                    return getUserContact;
                }
                else{
                    let getUserContact = await userModel.getNormalUserDataById(contact.contactID);
                    getUserContact.createAt = contact.createAt;
                    return getUserContact;
                }
            });
            let userConversations =  await Promise.all(userConversationstPromise);
            let groupConversations = await chatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS);
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations , (item) => {
                return -item.createAt;
            })
            resolve({
                allConversations : allConversations,
                groupConversations : groupConversations,
                userConversations : userConversations

            });
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    letAllConversationItems
};