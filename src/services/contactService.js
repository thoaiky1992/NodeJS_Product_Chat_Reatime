import contactModel from '../models/contactModel';
import userModel from '../models/userModel';
import _ from 'lodash';
let findUsersContact = (currentUserId,keyword) => {
    return new Promise( async (resolve,reject)=> {
        let deprecatedUserIds = []; // những ID không dùng nữa
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
module.exports = {
    findUsersContact
}