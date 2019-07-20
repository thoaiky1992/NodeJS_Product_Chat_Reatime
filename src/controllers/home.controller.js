import {notification} from './../services/index';
let getHome = async(req,res) => {
    //only 10 item on time
    let notifications = await notification.getNotifications(req.user._id);
    // get amount notifications unread
    let countNofityUnread = await notification.countNofityUnread(req.user._id);
    res.render('main/home/home',{
        errors :req.flash('errors'),
        success:req.flash('success'),
        user : req.user,
        notifications : notifications,
        countNofityUnread : countNofityUnread
    }) ;
}
module.exports = getHome;