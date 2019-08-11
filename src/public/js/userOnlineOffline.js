
// Step 01 
$(function(){
    
    socket.on('server-send-list-users-online',function(listUserIds){
        console.log(listUserIds)
        listUserIds.forEach(userId => {
            $(`.person[data-chat = ${userId}]`).find('div.dot').addClass('online');
            $(`.person[data-chat = ${userId}]`).find('img').addClass('avatar-online');
        })
    })
    socket.on('server-send-list-when-new-users-online',function(userNewOnline){
        $(`.person[data-chat = ${userNewOnline._id}]`).find('div.dot').addClass('online');
        $(`.person[data-chat = ${userNewOnline._id}]`).find('img').addClass('avatar-online');
        alertify.notify( `<strong>${userNewOnline.username}</strong> vừa mới online !!!`, 'success', 5);

    })
    socket.on('server-send-list-when-new-users-offline',function(userNewOffline){
        $(`.person[data-chat = ${userNewOffline._id}]`).find('div.dot').removeClass('online');
        $(`.person[data-chat = ${userNewOffline._id}]`).find('img').removeClass('avatar-online');
        alertify.notify( `<strong>${userNewOffline.username}</strong> vừa mới offline !!!`, 'error', 5);
    })
})