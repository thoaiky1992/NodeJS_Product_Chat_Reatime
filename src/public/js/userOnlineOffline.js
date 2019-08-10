
// Step 01 
$(function(){
    
    socket.on('server-send-list-users-online',function(listUserIds){
        console.log(listUserIds)
        listUserIds.forEach(userId => {
            $(`.person[data-chat = ${userId}]`).find('div.dot').addClass('online');
            $(`.person[data-chat = ${userId}]`).find('img').addClass('avatar-online');
        })
    })
    socket.on('server-send-list-when-new-users-online',function(userId){
        $(`.person[data-chat = ${userId}]`).find('div.dot').addClass('online');
        $(`.person[data-chat = ${userId}]`).find('img').addClass('avatar-online');

    })
    socket.on('server-send-list-when-new-users-offline',function(userId){
        $(`.person[data-chat = ${userId}]`).find('div.dot').removeClass('online');
        $(`.person[data-chat = ${userId}]`).find('img').removeClass('avatar-online');

    })
})