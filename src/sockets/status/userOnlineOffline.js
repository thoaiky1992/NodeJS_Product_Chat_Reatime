import {pushSocketIdToArray,removeSocketIdFromArray,emitNotifyToArray} from '../../helpers/socketHelper';
import userModel from '../../models/userModel';
/**
 * 
 * @param  io from socket.io lib 
 */
let userOnlineOffline = (io) => {
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
        socket.on('check-status',async() => {
            let listUserOnline = Object.keys(clients);
            // Step 01 : Emit to user after login or f5 web page
            socket.emit("server-send-list-users-online",listUserOnline)
            // Step 02 : Emit to all another user when new user online
            let userNewOnline = await userModel.getNormalUserDataById(socket.request.user._id);
            socket.broadcast.emit("server-send-list-when-new-users-online",userNewOnline);
        })
        socket.on('disconnect',async () => {
            // remove socketId when socket disconnected
            clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients,group._id,socket);
            })
            //Step 03 : Emit to all another user when new user offline
            let userNewOffline = await userModel.getNormalUserDataById(socket.request.user._id);
            socket.broadcast.emit("server-send-list-when-new-users-offline",userNewOffline)
        });
    })
}
module.exports = userOnlineOffline;