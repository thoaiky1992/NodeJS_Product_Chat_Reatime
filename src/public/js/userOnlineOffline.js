// Step 0 : 
socket.emit('check-status');
// Step 01 
socket.on('server-send-list-users-online',function(listUserIds){
    listUserIds.forEach(userId => {
        $(`.person[data-chat = ${userId}]`).find('div.dot').addClass('online');
        $(`.person[data-chat = ${userId}]`).find('img').addClass('avatar-online');
    })
})
socket.on('server-send-list-when-new-users-online',function(userNewOnline){
    $(`.person[data-chat = ${userNewOnline._id}]`).find('div.dot').addClass('online');
    $(`.person[data-chat = ${userNewOnline._id}]`).find('img').addClass('avatar-online');
    setTimeout(() => {
        alertify.notify( `<strong>${userNewOnline.username}</strong> vừa mới online !!!`, 'success', 5);
    },3000)

})
socket.on('server-send-list-when-new-users-offline',function(userNewOffline){
    $(`.person[data-chat = ${userNewOffline._id}]`).find('div.dot').removeClass('online');
    $(`.person[data-chat = ${userNewOffline._id}]`).find('img').removeClass('avatar-online');
    setTimeout(() => {
        alertify.notify( `<strong>${userNewOffline.username}</strong> vừa mới offline !!!`, 'error', 5);
    }, 3000);
})