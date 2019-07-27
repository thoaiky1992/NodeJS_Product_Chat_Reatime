import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestConctact';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
}
module.exports = initSockets;  