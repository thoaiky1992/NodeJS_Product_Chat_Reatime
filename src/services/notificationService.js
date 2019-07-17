import notificationModel from '../models/notificationModel';
import userModel from '../models/userModel';
/**
 * get notifications when F5 page
 * just 10 items one time
 * @param {String} currentUserId 
 * @param {number} limit 
 */
let getNotifications = (currentUserId,limit = 10) => {
    return new Promise(async (resolve,reject) => {
        try {
            let notifications = await notificationModel.model.getByUserIdAndLimit(currentUserId,limit);
            let getNotifyContents = notifications.map( async (notification) => {
                let sender = await userModel.findUserById(notification.senderId);
                return await notificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username,sender.avatar);
            })
            resolve(await Promise.all(getNotifyContents));
        } catch (error) {
            reject(error);
        }
    })
};
module.exports = {
    getNotifications
};