import {pushSocketIdToArray,removeSocketIdFromArray,emitNotifyToArray} from '../../helpers/socketHelper';
/**
 * 
 * @param  io from socket.io lib 
 */
let addNewContact = (io) => {
    let clients = {};
    io.on('connection', (socket) => {

        clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);
        
        socket.on('add-new-contact',(data) => {
            let currentUser = {
                id : socket.request.user._id,
                username : socket.request.user.username,
                avatar : socket.request.user.avatar,
                address : (socket.request.user.address !== null) ? socket.request.user.address : "",
            };
            // emit notification
            if(clients[data.contactId]){
                emitNotifyToArray(clients,data.contactId,io,'response-add-new-contact',currentUser);
            }
            
        });
        socket.on('disconnect',() => {
            // remove socketId when socket disconnected
            clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
        });
    })
}
module.exports = addNewContact;