import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestConctact';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import approveRequestContactReceived from './contact/approveRequestContactReceived';
import removeContact from './contact/removeContact';
import chatTextEmoji from './chat/chatTextEmojiContact';
import typingOn from './chat/typingOn';
import typingOff from './chat/typingOff';
import chatImage from './chat/chatImage';
import chatAttachment from './chat/chatAttachment.js';
import userOnlineOffline from './status/userOnlineOffline';
require('events').EventEmitter.defaultMaxListeners = 25;
let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    approveRequestContactReceived(io);
    removeContact(io);
    chatTextEmoji(io);
    typingOn(io);
    typingOff(io);
    chatImage(io);
    chatAttachment(io);
    userOnlineOffline(io);
}
module.exports = initSockets;  