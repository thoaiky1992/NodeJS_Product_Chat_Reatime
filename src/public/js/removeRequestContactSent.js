
function removeRequestContactSent() {
    $('.user-remove-request-contact-sent').unbind("click").on('click',function(){
        let targetID = $(this).data('uid');
        $.ajax({
            url : '/contact/remove-request-contact-sent',
            type : 'delete',
            data : {uid : targetID},
            success:function(data){
                if(data.success){
                    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetID}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid= ${targetID}]`).css({'display':'inline-block'});
                    decreaseNumberNotiContact("count-request-contact-sent");
                    //xoá ở modal tab đang chờ xác nhận
                    $('#request-contact-sent').find(`li[data-uid = ${targetID}]`).remove();
                    // xử lý realtime
                    socket.emit('remove-request-contact-sent',{contactId : targetID});
                }
            }
        })
    });
}
socket.on('response-remove-request-contact-sent',function(user){
    $('.noti_content').find(`div[data-uid = ${user.id}]`).remove(); // popup contify 
    $('ul.list-notifications').find(`li>div[data-uid = ${user.id}]`).parent().remove();
    // xoá ở modal yêu cầu kết bạn 
    $('#request-contact-received').find(`li[data-uid = ${user.id}]`).remove(); 
    decreaseNumberNotiContact("count-request-contact-received");

    decreaseNumberNotification("noti_contact_counter",1);
    decreaseNumberNotification("noti_counter",1);
})
$(document).ready(function(){
    removeRequestContactSent();
})