import { contact } from '../services/index';
let findUsersContact = async(req,res) => {
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await contact.findUsersContact(currentUserId,keyword);
        res.render('main/contact/sections/findUsersContact',{users:users} );
    } catch (error) {
        return res.status(500).send(error);
    }
}
let searchFriends = async(req,res) => {
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await contact.searchFriends(currentUserId,keyword);
        res.render('main/groupChat/sections/searchFriends',{users:users} );
    } catch (error) {
        return res.status(500).send(error);
    }
}
let searchConversations = async(req,res) => {
    try {
        let currentUserId = req.user._id;
        let keySearch = req.query.keySearch;
        let Conversations = await contact.searchConversations(currentUserId,keySearch);
        res.status(200).send(Conversations)
    } catch (error) {
        return res.status(500).send(error);
    }
}

let addNew = async (req,res) => {
    try {
        let currentId = req.user._id;
        let contactId = req.body.uid;
        let newContact = await contact.addNew(currentId,contactId);
        return res.status(200).send({success:!!newContact});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let removeContact = async (req,res) => {
    try {
        let currentId = req.user._id;
        let contactId = req.body.uid;
        let removeContact = await contact.removeContact(currentId,contactId);
        return res.status(200).send({success:!!removeContact});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let removeRequestContactSent = async (req,res) => {
    try {
        let currentId = req.user._id;
        let contactId = req.body.uid;
        let removeReq = await contact.removeRequestContactSent(currentId,contactId);
        return res.status(200).send({success:!!removeReq});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let readMoreContacts = async (req,res) => {
    try {
        // get skipNumber from query param
        let skipNumberContacts = +(req.query.skipNumber);
        // get more item
        let newContactUsers = await contact.readMoreContacts(req.user._id,skipNumberContacts);
        return res.status(200).send(newContactUsers);
    } catch (error) {
        res.status(500).send(error);
    }
}
let readMoreContactsSent = async (req,res) => {
    try {
        // get skipNumber from query param
        let skipNumberContacts = +(req.query.skipNumber);
        // get more item
        let newContactUsers = await contact.readMoreContactsSent(req.user._id,skipNumberContacts);
        return res.status(200).send(newContactUsers);
    } catch (error) {
        res.status(500).send(error);
    }
}
let readMoreContactsRecived = async (req,res) => {
    try {
        // get skipNumber from query param
        let skipNumberContacts = +(req.query.skipNumber);
        // get more item
        let newContactUsers = await contact.readMoreContactsRecived(req.user._id,skipNumberContacts);
        return res.status(200).send(newContactUsers);
    } catch (error) {
        res.status(500).send(error);
    }
}
let removeRequestContactReceived = async (req,res) => {
    try {
        let currentId = req.user._id;
        let contactId = req.body.uid;
        let removeReq = await contact.removeRequestContactReceived(currentId,contactId);
        return res.status(200).send({success:!!removeReq});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let approveRequestContactReceived = async (req,res) => {
    try {
        let currentId = req.user._id;
        let contactId = req.body.uid;
        let approveReq = await contact.approveRequestContactReceived(currentId,contactId);
        return res.status(200).send({success:!!approveReq});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let userInGroup = async (req,res) => {
    try {
        let targetId = req.query.targetId;
        let getUsers = await contact.userInGroup(targetId,req.user._id);
        return res.render('main/detailGroup/sections/userInGroup',{users:getUsers});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let checkFriend = async (req,res) => {
    try {
        let currentId = req.user._id;
        let targetId = req.query.targetId;
        let isCheckFriend = await contact.checkFriend(currentId,targetId);
        res.status(200).send(isCheckFriend);
    } catch (error) {
        return res.status(500).send(error);
    }
}
let searchUserNotInGroup = async (req,res) => {
    try {
        let groupChatId = req.query.groupChatId;
        let keySearch = req.query.keySearch;
        let currentUserId = req.user._id
        let getUsers = await contact.searchUserNotInGroup(groupChatId,keySearch,currentUserId);
    } catch (error) {
        return res.status(500).send(error);
    }
} 
module.exports = {
    findUsersContact,
    addNew,
    removeRequestContactSent,
    readMoreContacts,
    readMoreContactsSent,
    readMoreContactsRecived,
    removeRequestContactReceived,
    approveRequestContactReceived,
    removeContact,
    searchFriends,
    searchConversations,
    userInGroup,
    checkFriend,
    searchUserNotInGroup
}