import contactModel from '../models/contactModel';
import userModel from '../models/userModel';
import notificationModel from '../models/notificationModel';
import chatGroupModel from '../models/chatGroupModel';
import _ from 'lodash';
const LIMIT = 6;
let findUsersContact = (currentUserId,keyword) => {
    return new Promise( async (resolve,reject)=> {
        let deprecatedUserIds = [currentUserId]; // những ID không dùng nữa
        let contactByUsers = await contactModel.findAllByUser(currentUserId);
        contactByUsers.forEach((contact) => {
            deprecatedUserIds.push(contact.userID);
            deprecatedUserIds.push(contact.contactID);
        })
        deprecatedUserIds = _.uniqBy(deprecatedUserIds);
        let users = await userModel.findAllOrAddContact(deprecatedUserIds,keyword);
        resolve(users);
    });
}
let searchFriends = (currentUserId,keyword) => {
    return new Promise( async (resolve,reject)=> {
        let friendIds = [];
        let friends = await contactModel.getFriends(currentUserId);
        friends.forEach((item) => {
            friendIds.push(item.userID);
            friendIds.push(item.contactID);
        });
        friendIds = _.uniqBy(friendIds) ; // lọc những ID trùng trong mảng
        friendIds = friendIds.filter(userId => userId != currentUserId);
        let users = await userModel.findAllToAddGroupChat(friendIds,keyword);
        resolve(users);
    });
}

let addNew = (currentID, contactID) => {
    return new Promise(async(resolve,reject) => {
        let contactExists = await contactModel.checkExists(currentID,contactID)
        if(contactExists){
            return reject(false);
        }
        //create contact
        let newContactItem = {
            userID: currentID,
            contactID : contactID
        };
        let newContact = await contactModel.createNew(newContactItem);
        //create notification
        let notificationItem = {
            senderId : currentID,
            receiverId : contactID,
            type : notificationModel.types.ADD_CONTACT
        }
        await notificationModel.model.createNew(notificationItem);
        resolve(newContact);
    })
}
let removeContact = (currentID, contactID) => {
    return new Promise(async(resolve,reject) => {
        let removeContact = await contactModel.removeContact(currentID,contactID);
        if(removeContact.n === 0){
            return reject(false)
        }
        resolve(true);
    })
}
let removeRequestContactSent = (currentID, contactID) => {
    return new Promise(async(resolve,reject) => {
        let removeReq = await contactModel.removeRequestContactSent(currentID,contactID);
        if(removeReq.n === 0){
            return reject(false)
        }
        //remove notification
        let notifyTypeAddContact = notificationModel.types.ADD_CONTACT;
        await notificationModel.model.removeRequestContactNotification(currentID,contactID,notifyTypeAddContact);
        resolve(true);
    })
}
let getContacts = (currentID) => {
    return new Promise(async(resolve,reject) => {
        try {
            let contacts = await contactModel.getContacts(currentID,LIMIT);
            let users = contacts.map( async (contact) => {
                if(contact.contactID == currentID){
                    return await userModel.getNormalUserDataById(contact.userID);
                }
                else{
                    return await userModel.getNormalUserDataById(contact.contactID);
                }
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}
let getContactsSend = (currentID) => {
    return new Promise(async(resolve,reject) => {
        try {
            let contactsSend = await contactModel.getContactsSend(currentID,LIMIT);
            let users = contactsSend.map( async (contact) => {
                return await userModel.getNormalUserDataById(contact.contactID);
            })
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}
let getContactsRecevied = (currentID) => {
    return new Promise(async(resolve,reject) => {
        try {
            let contactsRecevied = await contactModel.getContactsRecevied(currentID,LIMIT);
            let users = contactsRecevied.map( async (contact) => {
                return await userModel.getNormalUserDataById(contact.userID);
            })
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}
let countAllContacts = (currentID) => {
    return new Promise(async(resolve,reject) => {
        try {
            let count = await contactModel.countAllContacts(currentID);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}
let countAllContactsSend = (currentID) => {
    return new Promise(async(resolve,reject) => {
        try {
            let count = await contactModel.countAllContactsSend(currentID);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}
let countAllContactsRecevied = (currentID) => {
    return new Promise(async(resolve,reject) => {
        try {
            let count = await contactModel.countAllContactsRecevied(currentID);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}
let readMoreContacts = (currentUserId,skipNumberContacts) => {
    return new Promise(async (resolve,reject) => {
        try {
            let newContacts = await contactModel.readMoreContacts(currentUserId,skipNumberContacts,LIMIT);
            let users = newContacts.map( async (contact) => {
                if(contact.contactID == currentUserId){
                    return await userModel.getNormalUserDataById(contact.userID);
                }
                else{
                    return await userModel.getNormalUserDataById(contact.contactID);
                }
            })
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}
let readMoreContactsSent = (currentUserId,skipNumberContacts) => {
    return new Promise(async (resolve,reject) => {
        try {
            let newContacts = await contactModel.readMoreContactsSent(currentUserId,skipNumberContacts,LIMIT);
            let users = newContacts.map( async (contact) => {
                return await userModel.getNormalUserDataById(contact.contactID);
            })
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}
let readMoreContactsRecived = (currentUserId,skipNumberContacts) => {
    return new Promise(async (resolve,reject) => {
        try {
            let newContacts = await contactModel.readMoreContactsRecived(currentUserId,skipNumberContacts,LIMIT);
            let users = newContacts.map( async (contact) => {
                return await userModel.getNormalUserDataById(contact.userID);
            })
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}
let removeRequestContactReceived = (currentID, contactID) => {
    return new Promise(async(resolve,reject) => {
        let removeReq = await contactModel.removeRequestContactReceived(currentID,contactID);
        if(removeReq.n === 0){
            return reject(false)
        }
        //remove notification
        //let notifyTypeAddContact = notificationModel.types.ADD_CONTACT;
        //await notificationModel.model.removeRequestContactReceivedNotification(currentID,contactID,notifyTypeAddContact);
        resolve(true);
    })
}
let approveRequestContactReceived = (currentID, contactID) => {
    return new Promise(async(resolve,reject) => {
        let approveReq = await contactModel.approveRequestContactReceived(currentID,contactID);
        if(approveReq.nModified === 0){
            return reject(false)
        }
        //create notification
        let notificationItem = {
            senderId : currentID,
            receiverId : contactID,
            type : notificationModel.types.APPROVE_CONTACT
        }
        await notificationModel.model.createNew(notificationItem);
        resolve(true);
    })
}
let searchConversations = (currentUserId,keySearch) => {
    return new Promise(async(resolve,reject) => {
        try {
            let conversationUserIds = await contactModel.getAllContacts(currentUserId);
            let conversationUsersPromise = conversationUserIds.map( async(item) => {
                if(item.contactID == currentUserId){
                    let user = await userModel.getNormalUserDataById(item.userID);
                    return user;
                }
                else{
                    let user = await userModel.getNormalUserDataById(item.contactID);
                    return user;
                }
            })
            let conversationUsers = await Promise.all(conversationUsersPromise);
            let conversationGroups = await chatGroupModel.getAllChatGroups(currentUserId);
            let allConversations = conversationGroups.concat(conversationUsers)
            resolve(allConversations);
        } catch (error) {
            reject(error)
        }
    })
}
let userInGroup = (targetId,currentUserId) => {
    return new Promise(async(resolve,reject) => {
        try {
            let getGroupChat = await chatGroupModel.getChatGroupById(targetId);
            let groupChat = getGroupChat.members.filter(item => {
                if(currentUserId != item.userID){
                    return item;
                }
            })
            let getAllUserInGroup = groupChat.map(async(item) => {
                let user = await userModel.getNormalUserDataById(item.userID);
                return user;
            })
            let AllUserInGroup = await Promise.all(getAllUserInGroup)
            resolve(AllUserInGroup);
        } catch (error) {
            reject(error)
        }
    })
}
let checkFriend = (currentId,targetId) => {
    return new Promise(async(resolve,reject) => {
        try {
            let getUser = await contactModel.checkExists(currentId,targetId);
            if(getUser){
                return resolve(true);
            }
            return resolve(false);
        } catch (error) {
            reject(error)
        }

    })
}
module.exports = {
    findUsersContact,
    addNew,
    removeRequestContactSent,
    getContacts,
    getContactsSend,
    getContactsRecevied,
    countAllContacts,
    countAllContactsSend,
    countAllContactsRecevied,
    readMoreContacts,
    readMoreContactsSent,
    readMoreContactsRecived,
    removeRequestContactReceived,
    approveRequestContactReceived,
    removeContact,
    searchFriends,
    searchConversations,
    userInGroup,
    checkFriend
}