function addContact() {
    $('.user-add-new-contact').bind('click',function(){
        let targetID = $(this).data('uid');
        $.post('/contact/add-new',{uid : targetID},function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetID}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid= ${targetID}]`).css({'display':'inline-block'});
                increaseNumberNotiContact("count-request-contact-sent");
                socket.emit('add-new-contact' , {contactID : targetID});
            }
        })
    });
}

socket.on('response-add-new-contact',function(user){
    let notify = `<span data-uid="${ user.id }">
                    <img class="avatar-small" src="images/users/${user.avatar}"
                        alt="">
                    <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
                </span><br><br><br>`;
    $('.noti_content').prepend(notify);
    increaseNumberNotiContact("count-request-contact-received");
    increaseNumberNotification("noci_contact_counter");
    increaseNumberNotification("noti_counter");
})
