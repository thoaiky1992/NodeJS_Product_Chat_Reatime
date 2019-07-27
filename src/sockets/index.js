import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestConctact';
let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
}
module.exports = initSockets;  