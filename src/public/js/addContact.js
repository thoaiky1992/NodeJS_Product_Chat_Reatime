function addContact() {
    $('.user-add-new-contact').bind('click',function(){
        let targetID = $(this).data('uid');
        $.post('/contact/add-new',{uid : targetID},function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetID}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid= ${targetID}]`).css({'display':'inline-block'});
                increaseNumberNotiContact("count-request-contact-sent");
                // thêm ở modal tab đang chờ xác nhận
                let userInfoHtml = $('#find-user').find(`ul li[data-uid = ${targetID}]`).get(0).outerHTML;
                $('#request-contact-sent').find('ul').prepend(userInfoHtml);
                socket.emit('add-new-contact' , {contactId : targetID});
            }
        })
    });
}

socket.on('response-add-new-contact',function(user){
    let notify = `<div class="notify-readed-false" data-uid="${ user.id }">
                    <img class="avatar-small" src="images/users/${user.avatar}"
                        alt="">
                    <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
    $('.noti_content').prepend(notify); // popup notifications
    $('ul.list-notifications').prepend(`<li>${notify}</li>`); // modal notifications
    increaseNumberNotiContact("count-request-contact-received");
    increaseNumberNotification("noti_contact_counter",1);
    increaseNumberNotification("noti_counter",1);
    // thêm ở modal tab yêu cầu kết bạn
    let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="images/users/${user.avatar}" alt="">
                            </div>
                            <div class="user-name">
                                <p>
                                    ${user.username}
                                </p>
                            </div>
                            <br>
                            <div class="user-address">
                                <span>&nbsp ${user.address}</span>
                            </div>
                            <div class="user-acccept-contact-received" data-uid="${user.id}">
                                Chấp nhận
                            </div>
                            <div class="user-reject-request-contact-received action-danger"
                                data-uid="${user.id}">
                                Xóa yêu cầu
                            </div>
                        </div>
                    </li>`;
    $('#request-contact-received').find('ul').prepend(userInfoHtml);
})
