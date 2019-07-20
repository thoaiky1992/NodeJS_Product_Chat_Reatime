import notificationModel from '../models/notificationModel';
import userModel from '../models/userModel';
const limit = 6;
/**
 * get notifications when F5 page
 * just 10 items one time
 * @param {String} currentUserId 
 * @param {number} limit 
 */
let getNotifications = (currentUserId) => {
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
/**
 * count all notifications unread
 * @param {String} currentUserId 
 */
let countNofityUnread = (currentUserId) => {
    return new Promise(async (resolve,reject) => {
        try {
            let notificationUnread = await notificationModel.model.countNofityUnread(currentUserId);
            resolve(notificationUnread);
        } catch (error) {
            reject(error);
        }
    })
};
let readMore = (currentUserId , skipNumberNotification) => {
    return new Promise(async (resolve,reject) => {
        try {
            let newNotifications = await notificationModel.model.readMore(currentUserId,skipNumberNotification,limit);

            let getNotifyContents = newNotifications.map( async (notification) => {
                let sender = await userModel.findUserById(notification.senderId);
                return await notificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username,sender.avatar);
            })
            resolve(await Promise.all(getNotifyContents));
        } catch (error) {
            reject(error);
        }
    })
}
/**
 * 
 * @param {string} currentUserId 
 * @param {array} skipNumberNotification 
 */
let markNotificationAsRead = (currentUserId , markArrayUserId) => {
    return new Promise(async (resolve,reject) => {
        try {
            await notificationModel.model.markNotificationAsRead(currentUserId,markArrayUserId);
            resolve(true);
        } catch (error) {
            reject(false);
        }
    })
}
module.exports = {
    getNotifications,
    countNofityUnread,
    readMore,
    markNotificationAsRead
};