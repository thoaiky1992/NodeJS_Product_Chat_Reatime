import {contact} from '../services/index';
let findUsersContact = async(req,res) => {
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await contact.findUsersContact(currentUserId,keyword);
        res.render('main/contact/sections/findUsersContact',{users:users} );
    } catch (error) {
        console.log(error);
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
let removeRequestContact = async (req,res) => {
    try {
        let currentId = req.user._id;
        let contactId = req.body.uid;
        let removeReq = await contact.removeRequestContact(currentId,contactId);
        return res.status(200).send({success:!!removeReq});
    } catch (error) {
        return res.status(500).send(error);
    }
}
module.exports = {
    findUsersContact,
    addNew,
    removeRequestContact
}