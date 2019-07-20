function markNotificationAsRead(targetUser){
    $.ajax({
        url : '/notification/mark-notify-read',
        type: "put",
        data : {targetUser: targetUser},
        success:function(result){
            if(result){
                targetUser.forEach(function(uid){
                    $('.noti_content').find(`div[data-uid = ${uid}]`).removeClass('notify-readed-false');
                    $('ul.list-notifications').find(`li>div[data-uid = ${uid}]`).removeClass('notify-readed-false');
                });
                decreaseNumberNotification("noti_counter",targetUser.length);
            }
        }
    })
}
$(function(){
    // link at popup notifications
    $('#popup-mark-notify-as-read').bind('click',function(){
        let targetUsers = [];
        $('.noti_content').find(`div.notify-readed-false`).each(function(index,notification){
            targetUsers.push($(notification).data("uid"));
        });
        if(!targetUsers){
            alertify.notify('Bạn đã đọc hết thông báo !!!','error',7);
            return false;
        }
        markNotificationAsRead(targetUsers);
    })
    // link at modal notifications
    $('#modal-mark-notify-as-read').bind('click',function(){
        let targetUsers = [];
        $('ul.list-notifications').find('li>div.notify-readed-false').each(function(index,notification){
            targetUsers.push($(notification).data("uid"));
        });
        if(!targetUsers){
            alertify.notify('Bạn đã đọc hết thông báo !!!','error',7);
            return false;
        }
        markNotificationAsRead(targetUsers);
    });
})