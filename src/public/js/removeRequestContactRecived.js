
function removeRequestContactReceived() {
    $('.user-remove-request-contact-received').unbind("click").on('click',function(){
        let targetID = $(this).data('uid');
        $.ajax({
            url : '/contact/remove-request-contact-received',
            type : 'delete',
            data : {uid : targetID},
            success:function(data){
                if(data.success){
                    //$('.noti_content').find(`div[data-uid = ${user.id}]`).remove(); // popup contify 
                    //$('ul.list-notifications').find(`li>div[data-uid = ${user.id}]`).parent().remove();
                    //decreaseNumberNotification("noti_counter",1);
                    removeRequestContactReceived();
                    decreaseNumberNotification("noti_contact_counter",1);

                    decreaseNumberNotiContact("count-request-contact-received");
                    // xoá ở modal yêu cầu kết bạn 
                    $('#request-contact-received').find(`li[data-uid = ${targetID}]`).remove(); 
                    // xử lý realtime
                    socket.emit('remove-request-contact-received',{contactId : targetID});
                }
            }
        })
    });
}
socket.on('response-remove-request-contact-received',function(user){
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid= ${user.id}]`).css({'display':'inline-block'});

    $('.noti_content').find(`div[data-uid = ${user.id}]`).remove(); // popup contify 
    $('ul.list-notifications').find(`li>div[data-uid = ${user.id}]`).parent().remove();
    
    //xoá ở modal tab đang chờ xác nhận
    $('#request-contact-sent').find(`li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotiContact("count-request-contact-sent");

    decreaseNumberNotification("noti_contact_counter",1);
    
})
$(document).ready(function(){
    removeRequestContactReceived();
})