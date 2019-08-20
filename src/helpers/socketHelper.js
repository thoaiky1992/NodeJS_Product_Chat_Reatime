import _ from 'lodash';
export let pushSocketIdToArray = (clients,userId,socketId) => { 
    if(clients[userId]){
        clients[userId].push(socketId);
    }else{
        clients[userId] = [socketId];
    }
    for(let i = 0 ; i < clients.length ; i++){
        clients[i] = _.uniqBy(clients[i]);
    }
    return clients;
};

export let emitNotifyToArray = (clients,userId,io,eventName,data) => {
    clients[userId] = _.uniqBy(clients[userId]);
    clients[userId].forEach(socketId => io.to(socketId).emit(eventName,data));
};

export let removeSocketIdFromArray = (clients,userId,socket) => {
    clients[userId] = clients[userId].filter(socketId => socketId !== socket.id );
    if(!clients[userId].length){
        delete clients[userId];
    }
    return clients;
};