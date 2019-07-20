import {notification} from '../services/index';
let readMore = async (req,res) => {
    try {
        // get skipNumber from query param
        let skipNumberNotification = +(req.query.skipNumber);
        // get more item
        let newNotifications = await notification.readMore(req.user._id,skipNumberNotification);
        return res.status(200).send(newNotifications);
    } catch (error) {
        res.status(500).send(error);
    }
}
let markNotificationAsRead  = async (req,res) => {
    try {
        let mark = await notification.markNotificationAsRead(req.user._id,req.body.targetUser);
        res.status(200).send(mark);
    } catch (error) {
        res.status(500).send(error)   
    }
}
module.exports = {
    readMore,
    markNotificationAsRead
}