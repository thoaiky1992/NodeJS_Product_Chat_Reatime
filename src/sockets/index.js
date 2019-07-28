import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestConctact';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import approveRequestContactReceived from './contact/approveRequestContactReceived';

let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    approveRequestContactReceived(io);
}
module.exports = initSockets;  