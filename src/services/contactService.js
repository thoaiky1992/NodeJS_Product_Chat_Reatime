import contactModel from '../models/contactModel';
import userModel from '../models/userModel';
import notificationModel from '../models/notificationModel';
import _ from 'lodash';
const LIMIT = 1;
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
let removeRequestContact = (currentID, contactID) => {
    return new Promise(async(resolve,reject) => {
        let removeReq = await contactModel.removeRequestContact(currentID,contactID);
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

module.exports = {
    findUsersContact,
    addNew,
    removeRequestContact,
    getContacts,
    getContactsSend,
    getContactsRecevied,
    countAllContacts,
    countAllContactsSend,
    countAllContactsRecevied,
    readMoreContacts,
    readMoreContactsSent,
    readMoreContactsRecived
}