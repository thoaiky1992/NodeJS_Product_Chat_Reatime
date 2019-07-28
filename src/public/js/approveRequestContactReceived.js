
function approveRequestContactReceived() {
    $('.user-approve-request-contact-received').unbind("click").on('click',function(){
        let targetID = $(this).data('uid');
        $.ajax({
            url : '/contact/approve-request-contact-received',
            type : 'put',
            data : {uid : targetID},
            success:function(data){
                if(data.success){
                    let userInfo = $('#request-contact-received').find(`ul li[data-uid = ${targetID}]`);
                    $(userInfo).find("div.user-approve-request-contact-received").remove();
                    $(userInfo).find("div.user-remove-request-contact-received").remove();
                    $(userInfo).find("div.contactPanel").append(`
                        <div class="user-talk" data-uid="${targetID}">
                            Trò chuyện
                        </div>
                        <div class="user-remove-contact action-danger" data-uid="${targetID}">
                            Xóa liên hệ
                        </div>
                    `);
                    let userInfoHTML = userInfo.get(0).outerHTML;
                    $('#contacts').find("ul").prepend(userInfoHTML);
                    $(userInfo).remove();

                    decreaseNumberNotiContact("count-request-contact-received");
                    increaseNumberNotiContact("count-contacts");
                    decreaseNumberNotification("noti_contact_counter",1);
                    removeContact();

                    socket.emit('approve-request-contact-received',{contactId : targetID});
                    
                }
            }
        })
        
    });
}
socket.on('response-approve-request-contact-received',function(user){
    let notify = `<div class="notify-readed-false" data-uid="${ user.id }">
                    <img class="avatar-small" src="images/users/${user.avatar}"
                        alt="">
                    <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
                </div>`;
    $('.noti_content').prepend(notify); // popup notifications
    $('ul.list-notifications').prepend(`<li>${notify}</li>`); // modal notifications

    decreaseNumberNotification("noti_contact_counter");
    increaseNumberNotification("noti_counter",1);

    decreaseNumberNotiContact("count-request-contact-sent");
    increaseNumberNotiContact("count-contacts");
    $('#request-contact-sent').find(`ul li[data-uid = ${user.id}]`).remove();
    $('#find-user').find(`ul li[data-uid = ${user.id}]`).remove();
    let userInfoHTML = `
    <li class="_contactList" data-uid="${user.id}">
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
            <div class="user-talk" data-uid="${user.id}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${user.id}">
                Xóa liên hệ
            </div>
        </div>
    </li>
    `;
    $('#contacts').find("ul").prepend(userInfoHTML);
    removeContact();
})
$(document).ready(function(){
    approveRequestContactReceived();
})