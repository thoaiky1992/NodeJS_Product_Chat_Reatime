import {pushSocketIdToArray,removeSocketIdFromArray,emitNotifyToArray} from '../../helpers/socketHelper';
/**
 * 
 * @param  io from socket.io lib 
 */
let removeRequestContactReceived = (io) => {
    let clients = {};
    io.on('connection', (socket) => {
        clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);
        
        socket.on('remove-request-contact-received',(data) => {
            let currentUser = {
                id : socket.request.user._id
            };
            // emit notification
            if(clients[data.contactId]){
                emitNotifyToArray(clients,data.contactId,io,"response-remove-request-contact-received",currentUser);
            }
        });
        socket.on('disconnect',() => {
            // remove socketId when socket disconnected
            clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
        });
    })
}
module.exports = removeRequestContactReceived;