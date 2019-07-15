import contactModel from '../models/contactModel';
import userModel from '../models/userModel';
import _ from 'lodash';
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
        let newContactItem = {
            userID: currentID,
            contactID : contactID
        };
        let newContact = await contactModel.createNew(newContactItem);
        resolve(newContact);
    })
}
let removeRequestContact = (currentID, contactID) => {
    return new Promise(async(resolve,reject) => {
        let removeReq = await contactModel.removeRequestContact(currentID,contactID);
        if(removeReq.n === 0){
            return reject(false)
        }
        resolve(true);
    })
}
module.exports = {
    findUsersContact,
    addNew,
    removeRequestContact
}