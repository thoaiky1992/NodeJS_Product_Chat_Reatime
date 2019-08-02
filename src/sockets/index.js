import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestConctact';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import approveRequestContactReceived from './contact/approveRequestContactReceived';
import removeContact from './contact/removeContact';
import chatTextEmoji from './chat/chatTextEmojiContact';
import typingOn from './chat/typingOn';
import typingOff from './chat/typingOff';
import chatImage from './chat/chatImage';
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
}
module.exports = initSockets;  