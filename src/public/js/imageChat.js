function bufferToBase64(buffer){
    return  btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}
function imageChat(divId){
    $(`#image-chat-${divId}`).unbind('change').on('change',function(){
        changeInfo = true;
        let fileData = $(this).prop('files')[0];
        let math = ['image/png','image/jpg','image/jpeg'];
        let limit = 1048576; // byte = 1MB
        if($.inArray(fileData.type,math) === -1){
            alertify.notify('Kiểu file không hợp lệ ! chỉ chấp nhận JPG - JNG - JPEG','error',7);
            $(this).val(null);
            return false;
        }
        if(fileData.size > limit){
            alertify.notify('Ảnh upload chỉ cho phép dưới 1MB','error',7);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data('chat');
        let isChatGroup = false;
        let messageFormData =  new FormData();
        messageFormData.append('my-image-chat',fileData);
        messageFormData.append('uid',targetId);
        if($(this).hasClass('chat-in-group')){
            messageFormData.append('isChatGroup',true);
            isChatGroup = true;
        }
        $.ajax({
            url : '/message/add-new-image',
            type : 'post',
            cache : false,
            contentType : false,
            processData : false,
            data : messageFormData,
            success:function(data){
                let dataToEmit = {
                    message : data.message
                }
                // step 01 :  handle message data before show
                let messageOfMe = $(`<div class="bubble convert-emoji me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
                let imageChat = `<img src="data:${data.message.file.contentType}; base64 , ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat">`;
                if(isChatGroup){
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small you-avatar" title="${data.message.sender.name}" alt="">`;
                    messageOfMe.html(`${senderAvatar} ${imageChat}`);
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                }else{
                    messageOfMe.html(imageChat);
                    dataToEmit.contactId = targetId;
                }
                //step 02 : append message data to screen
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);
                // step 03 : remove all data input : nothing to code
                // step 04 : change data preview $ time in leftSide 
                $(`.person[data-chat = ${divId}]`).find("span.time").removeClass('message-time-realtime').html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat = ${divId}]`).find("span.preview").html("Hình ảnh ...");
                //step 05 : move conversation to top
                $(`.person[data-chat = ${divId}]`).on('kysmile.moveConversationToTheTop',function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("kysmile.moveConversationToTheTop");
                })
                //step 06 : emit realtime
                socket.emit('chat-image',dataToEmit);
                // step 07 : emit remove typing real-time : nothing to code
                // step 08 : if this has typing . remove that immediate : : nothing to code
                // step 09 : Add to modal image
                let imageChatToADdModal = `<img src="data:${data.message.file.contentType}; base64 , ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat-modal">`;
                $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToADdModal);

            },
            error:function(error){
                alertify.notify(error,'error',7);
            }
        });
    })
}
$(document).ready(function(){
    socket.on('response-chat-image',function(response){
        let divId = "";
        // step 01 :  handle message data before show
        let messageOfYou = $(`<div class="bubble convert-emoji you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
        let imageChat = `<img src="data:${response.message.file.contentType}; base64 , ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat">`;

        if(response.currentGroupId){
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small you-avatar" title="${response.message.sender.name}" alt="">`;
            messageOfYou.html(`${senderAvatar} ${imageChat}`);
            divId = response.currentGroupId;
            if(response.currentUserId !== $("#dropdown-navbar-user").data('uid')){
                increaseNumberMessageGroup(divId);
            }
        }else{
            divId = response.currentUserId;
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small you-avatar" title="${response.message.sender.name}" alt="">`;
            messageOfYou.html(`${senderAvatar} ${imageChat}`);
        }
        
        //step 02 : append message data to screen
        if(response.currentUserId !== $("#dropdown-navbar-user").data('uid')){
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat = ${divId}]`).find("span.time").addClass('message-time-realtime');
        }
        // step 04 : change data preview $ time in leftSide 
        $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat = ${divId}]`).find("span.preview").html("Hình ảnh ...");

        //step 05 : move conversation to top
        $(`.person[data-chat = ${divId}]`).on('kysmile.moveConversationToTheTop',function(){
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("kysmile.moveConversationToTheTop");
        })
        $(`.person[data-chat = ${divId}]`).trigger('kysmile.moveConversationToTheTop');
        // step 09 : Add to modal image
        if(response.currentUserId !== $("#dropdown-navbar-user").data('uid')){
            let imageChatToADdModal = `<img src="data:${response.message.file.contentType}; base64 , ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat-modal">`;
            $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToADdModal);
        }

        
    })
})