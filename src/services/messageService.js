import contactModel from './../models/contactModel';
import userModel from './../models/userModel';
import chatGroupModel from './../models/chatGroupModel';
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
                    return await userModel.getNormalUserDataById(contact.userID);
                }
                else{
                    return await userModel.getNormalUserDataById(contact.contactID);
                }
            });
            let userConversations =  await Promise.all(userConversationstPromise);
            let groupConversations = await chatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS);
            console.log(userConversations);
            console.log("----------------------------------");
            console.log(groupConversations);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    letAllConversationItems
};