import {pushSocketIdToArray,removeSocketIdFromArray,emitNotifyToArray} from '../../helpers/socketHelper';
/**
 * 
 * @param  io from socket.io lib 
 */
let chatAttachment = (io) => {
    let clients = {};
    io.on('connection', (socket) => {
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
        socket.on('add-new-user-to-group', async function(data){
            clients[data.groupChatId].push(clients[data.user._id]);
        })
        socket.on('chat-attachment',(data) => {
            if(data.groupId){
                let response = {
                    currentGroupId : data.groupId,
                    currentUserId : socket.request.user._id,
                    message : data.message
                }
                // emit notification
                if(clients[data.groupId]){
                    emitNotifyToArray(clients,data.groupId,io,'response-chat-attachment',response);
                }
            }
            if(data.contactId){
                let response = {
                    currentUserId : socket.request.user._id,
                    message : data.message
                }
                // emit notification
                if(clients[data.contactId]){
                    emitNotifyToArray(clients,data.contactId,io,'response-chat-attachment',response);
                }
            } 
        });
        socket.on('disconnect',() => {
            // remove socketId when socket disconnected
            clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients,group._id,socket);
            })
        });
    })
}
module.exports = chatAttachment;