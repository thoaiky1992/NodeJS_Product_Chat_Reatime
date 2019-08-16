import {pushSocketIdToArray,removeSocketIdFromArray,emitNotifyToArray} from '../../helpers/socketHelper';
import userModel from '../../models/userModel';
/**
 * 
 * @param  io from socket.io lib 
 */
let addNewUserToGroupChat = (io) => {
    let clients = {};
    io.on('connection', async (socket) => {

        clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients,group._id,socket.id);
        })
        socket.on('new-group-created',(data) => {
            clients = pushSocketIdToArray(clients,data.groupChat._id,socket.id);
        })
        socket.on('member-received-group-chat',(data) => {
            clients = pushSocketIdToArray(clients,data.groupChatId,socket.id);
        });
        socket.on('add-new-user-to-group',function(data){
            if(clients[data.groupChatId]){
                clients[data.groupChatId].forEach(socketId => {
                    if(socketId != socket.id){
                        io.sockets.connected[socketId].emit('response-add-new-user-to-group',data)
                    }
                });
            }
        })
        socket.on('disconnect',async () => {
            // remove socketId when socket disconnected
            clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients,group._id,socket);
            })
        });
    })
}
module.exports = addNewUserToGroupChat;