import { notification , contact , message } from './../services/index';
import { bufferToBase64 , lastItemofArray , convertTimestampToHumanTime } from './../helpers/clientHelper';
let getHome = async(req,res) => {
    //only 10 item on time
    let notifications = await notification.getNotifications(req.user._id);
    // get amount notifications unread
    let countNofityUnread = await notification.countNofityUnread(req.user._id);
    // get contacts (10 item on time)
    let contacts = await contact.getContacts(req.user._id);
    // get contacts send (10 item on time)
    let contactsSend = await contact.getContactsSend(req.user._id);
    // get contacts recevied(10 item on time)
    let contactsRecevied = await contact.getContactsRecevied(req.user._id);
    // count contacts
    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactsSend = await contact.countAllContactsSend(req.user._id);
    let countAllContactsRecevied = await contact.countAllContactsRecevied(req.user._id)

    let letAllConversationItems = await message.letAllConversationItems(req.user._id);

    // all messages with conversations , 30 item
    let allConversationWithMessage = letAllConversationItems.allConversationWithMessage;
    res.render('main/home/home',{
        errors :req.flash('errors'),
        success:req.flash('success'),
        user : req.user,
        notifications : notifications,
        countNofityUnread : countNofityUnread,
        contacts : contacts,
        contactsSend : contactsSend,
        contactsRecevied : contactsRecevied,
        countAllContacts : countAllContacts,
        countAllContactsSend : countAllContactsSend,
        countAllContactsRecevied : countAllContactsRecevied,
        allConversationWithMessage : allConversationWithMessage,
        bufferToBase64 : bufferToBase64,
        lastItemofArray : lastItemofArray,
        convertTimestampToHumanTime : convertTimestampToHumanTime
    }) ;
}
module.exports = getHome;