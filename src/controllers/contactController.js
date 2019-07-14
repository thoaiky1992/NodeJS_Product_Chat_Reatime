import {contact} from '../services/index';
let findUsersContact = async(req,res) => {
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await contact.findUsersContact(currentUserId,keyword);
        console.log(users);

        res.render('main/contact/sections/findUsersContact',{users:users} );
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
module.exports = {
    findUsersContact
}