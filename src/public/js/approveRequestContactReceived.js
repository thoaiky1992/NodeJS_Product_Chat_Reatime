function approveRequestContactReceived() {
    $('.user-approve-request-contact-received').unbind("click").on('click',function(){
        let targetID = $(this).data('uid');
        let targetName = $(this).parent().find("div.user-name>p").text().trim();
        let targetAvatar = $(this).parent().find('div.user-avatar>img').attr('src');
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
                    // Step 01 : hide modal
                    // $('#contactModal').modal('hide');
                    // Step 02 : handle leftside.ejs
                    let subUserName = targetName;
                    if(subUserName.length > 15){
                    subUserName = subUserName.substr(0,11)
                    }
                    let leftSideData = `<a href="#uid_${targetID}" class="room-chat" data-target="#to_${targetID}">
                            <li class="person" data-chat="${targetID}">
                                <div class="left-avatar">
                                    <div class="dot"></div>
                                    <img src="${targetAvatar}" alt="">
                                </div>
                                <span class="name">
                                    ${subUserName}
                                </span>
                                <span class="time"></span>
                                <span class="preview convert-emoji">
                                </span>
                            </li>
                        </a>`;
                        $('#all-chat').find("ul").prepend(leftSideData);
                        $('#user-chat').find("ul").prepend(leftSideData);
                        // Step 03 : hanle rightSide.ejs
                        let rightSideData = `<div class="right tab-pane" data-chat="${targetID}" id="to_${targetID}">
                        <div class="top">
                            <span>To: <span class="name">${targetName}</span></span>
                            <span class="chat-menu-right">
                                <a href="#attachmentsModal_${targetID}" class="show-attachments" data-toggle="modal">
                                    Tệp đính kèm
                                    <i class="fa fa-paperclip"></i>
                                </a>
                            </span>
                            <span class="chat-menu-right">
                                <a href="javascript:void(0)">&nbsp;</a>
                            </span>
                            <span class="chat-menu-right">
                                <a href="#imagesModal_${targetID}" class="show-images" data-toggle="modal">
                                    Hình ảnh
                                    <i class="fa fa-photo"></i>
                                </a>
                            </span>
                        </div>
                        <div class="content-chat">
                            <div class="chat" data-chat="${targetID}">
                            </div>
                        </div>
                        <div class="write" data-chat="${targetID}">
                            <input type="text" class="write-chat" id="write-chat-${targetID}" data-chat="${targetID}">
                            <div class="icons">
                                <a href="#" class="icon-chat" data-chat="${targetID}"><i class="fa fa-smile-o"></i></a>
                                <label for="image-chat-${targetID}">
                                    <input type="file" id="image-chat-${targetID}" name="my-image-chat" class="image-chat" data-chat="${targetID}">
                                    <i class="fa fa-photo"></i>
                                </label>
                                <label for="attachment-chat-${targetID}">
                                    <input type="file" id="attachment-chat-${targetID}" name="my-attachment-chat" class="attachment-chat" data-chat="${targetID}">
                                    <i class="fa fa-paperclip"></i>
                                </label>
                                <a href="#streamModal" id="video-chat" class="video-chat" data-chat="${targetID}" data-toggle="modal">
                                    <i class="fa fa-video-camera"></i>
                                </a>
                                <input type="hidden" id="peer-id" value="">
                            </div>
                        </div>
                    </div>`;
                    $('#screen-chat').prepend(rightSideData);
                    // Step 04 : call function changeScreenChat
                    changeScreenChat();
                    // Step 05 : handle imageModal
                    let imageModalData = `<div class="modal fade" id="imagesModal_${targetID}" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện . </h4>
                                </div>
                                <div class="modal-body">
                                    <div class="all-images" style="visibility: hidden;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    $('body').append(imageModalData);
                    // Step 06 : call function gridPhotos
                    gridPhotos(5);
                    // Step 07 : handle attachmentModal
                    let attachmentModalData = `<div class="modal fade" id="attachmentsModal_${targetID}" role="dialog">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">All Attachs in this conversation.</h4>
                            </div>
                            <div class="modal-body">
                                <ul class="list-attachments">
                                </ul>
                            </div>
                        </div>
                    </div>
                    </div>`;
                    $('body').append(attachmentModalData);
                    // Step 08 : update online
                    socket.emit('check-status');
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

    decreaseNumberNotification("noti_contact_counter",1);
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
    // Step 01 : hide model : nothing to code
    // Step 02 : handle leftside.ejs
    let subUserName = user.username;
    if(subUserName.length > 15){
    subUserName = subUserName.substr(0,11)
    }
    let leftSideData = `<a href="#uid_${user.id}" class="room-chat" data-target="#to_${user.id}">
            <li class="person" style="height:70px;" data-chat="${user.id}">
                <div class="left-avatar">
                    <div class="dot"></div>
                    <img src="images/users/${user.avatar}" alt="">
                </div>
                <span class="name">
                    ${subUserName}
                </span>
                <span class="time"></span>
                <span class="preview convert-emoji">
                </span>
            </li>
        </a>`;
        $('#all-chat').find("ul").prepend(leftSideData);
        $('#user-chat').find("ul").prepend(leftSideData);
        // Step 03 : hanle rightSide.ejs
        let rightSideData = `<div class="right tab-pane" data-chat="${user.id}" id="to_${user.id}">
        <div class="top">
            <span>To: <span class="name">${user.username}</span></span>
            <span class="chat-menu-right">
                <a href="#attachmentsModal_${user.id}" class="show-attachments" data-toggle="modal">
                    Tệp đính kèm
                    <i class="fa fa-paperclip"></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
                    Hình ảnh
                    <i class="fa fa-photo"></i>
                </a>
            </span>
        </div>
        <div class="content-chat">
            <div class="chat" data-chat="${user.id}">
            </div>
        </div>
        <div class="write" data-chat="${user.id}">
            <input type="text" class="write-chat" id="write-chat-${user.id}" data-chat="${user.id}">
            <div class="icons">
                <a href="#" class="icon-chat" data-chat="${user.id}"><i class="fa fa-smile-o"></i></a>
                <label for="image-chat-${user.id}">
                    <input type="file" id="image-chat-${user.id}" name="my-image-chat" class="image-chat" data-chat="${user.id}">
                    <i class="fa fa-photo"></i>
                </label>
                <label for="attachment-chat-${user.id}">
                    <input type="file" id="attachment-chat-${user.id}" name="my-attachment-chat" class="attachment-chat" data-chat="${user.id}">
                    <i class="fa fa-paperclip"></i>
                </label>
                <a href="#streamModal" id="video-chat" class="video-chat" data-chat="${user.id}" data-toggle="modal">
                    <i class="fa fa-video-camera"></i>
                </a>
                <input type="hidden" id="peer-id" value="">
            </div>
        </div>
    </div>`;
    $('#screen-chat').prepend(rightSideData);
    // Step 04 : call function changeScreenChat
    changeScreenChat();
    // Step 05 : handle imageModal
    let imageModalData = `<div class="modal fade" id="imagesModal_${user.id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện . </h4>
                </div>
                <div class="modal-body">
                    <div class="all-images" style="visibility: hidden;">
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    $('body').append(imageModalData);
    // Step 06 : call function gridPhotos
    gridPhotos(5);
    // Step 07 : handle attachmentModal
    let attachmentModalData = `<div class="modal fade" id="attachmentsModal_${user.id}" role="dialog">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">All Attachs in this conversation.</h4>
            </div>
            <div class="modal-body">
                <ul class="list-attachments">
                </ul>
            </div>
        </div>
    </div>
    </div>`;
    $('body').append(attachmentModalData);
    // Step 08 : update online
    socket.emit('check-status');
})
$(document).ready(function(){
    approveRequestContactReceived();
})