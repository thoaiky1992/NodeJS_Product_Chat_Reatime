import {pushSocketIdToArray,removeSocketIdFromArray,emitNotifyToArray} from '../../helpers/socketHelper';
import userModel from '../../models/userModel';
import groupChatModel from '../../models/chatGroupModel';
import messageModel from '../../models/messageModel';
import _ from 'lodash';
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
        socket.on('add-new-user-to-group', async function(data){
            let groupChat = await groupChatModel.getChatGroupById(data.groupChatId);
            let getAllMessageInGroup = await messageModel.model.getAllMessageInGroup(data.groupChatId);
            data.groupChat = groupChat;
            data.message = getAllMessageInGroup;
            clients[data.groupChatId].push(clients[data.user._id][0]);
            clients[data.groupChatId] = _.uniqBy(clients[data.groupChatId]);
            for(let i = 0 ;  i <  clients[data.groupChatId].length ; i++){
                if(clients[data.groupChatId][i] != socket.id){
                    io.to(clients[data.groupChatId][i]).emit('response-add-new-user-to-group',data);
                }
            }
        })
        socket.on('leave-group',function(data){
            for(let i = 0 ; i < clients[data].length ; i++){
                if(clients[data][i] == socket.id){
                    clients[data].splice(i,1);
                }
            }
            if(clients[data]){
                clients[data].forEach(socketId => {
                    io.to(socketId).emit('response-leave-group',data);
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