function textAndEmojiChat(divId){
    $(".emojionearea ").unbind('keyup').on('keyup',function(e){
        let currentEmojioneArea = $(this);
        if(e.which === 13){
            let targetId = $(`#write-chat-${divId}`).data('chat');
            let messageVal = $(`#write-chat-${divId}`).val();

            if(!targetId || !messageVal){
                return false;
            }
            let dataTextEmojiForSend = {
                uid : targetId,
                messageVal : messageVal
            }
            if($(`#write-chat-${divId}`).hasClass('chat-in-group')){
                dataTextEmojiForSend.isChatGroup = true;
            }
            // call send message
            $.post("/message/add-new-text-emoji",dataTextEmojiForSend,function(data){
                let dataToEmit = {
                    message : data.message
                }
                // step 01 :  handle message data before show
                let messageOfMe = $(`<div class="bubble convert-emoji me" data-mess-id="${data.message._id}"></div>`);
                messageOfMe.text(data.message.text);
                let convertEmojiMessage = emojione.toImage(messageOfMe.html());
                if(dataTextEmojiForSend.isChatGroup){
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small you-avatar" title="${data.message.sender.name}" alt="">`;
                    messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                }else{
                    messageOfMe.html(convertEmojiMessage);
                    dataToEmit.contactId = targetId;
                }
                //step 02 : append message data to screen
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                // step 03 : remove all data input
                $(`#write-chat-${divId}`).val("");
                currentEmojioneArea.find('.emojionearea-editor').text("");

                // step 04 : change data preview $ time in leftSide 
                $(`.person[data-chat = ${divId}]`).find("span.time").removeClass('message-time-realtime').html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat = ${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                //step 05 : move conversation to top
                $(`.person[data-chat = ${divId}]`).on('kysmile.moveConversationToTheTop',function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("kysmile.moveConversationToTheTop");
                })
                $(`.person[data-chat = ${divId}]`).trigger('kysmile.moveConversationToTheTop');

                //step 06 : emit realtime
                socket.emit('chat-text-emoji',dataToEmit);

                // step 07 : emit remove typing real-time
                typingOff(divId);

                // step 08 : if this has typing . remove that immediate
                let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
                if(checkTyping.length){
                    checkTyping.remove();
                }
                nineScrollRight(divId);
            }).fail(function(response){
                console.log(response)
            })
        }
    })
}
$(document).ready(function(){
    socket.on('response-chat-text-emoji',function(response){
        let divId = "";
        // step 01 :  handle message data before show
        let messageOfYou = $(`<div class="bubble convert-emoji you" data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfYou.html());
        if(response.currentGroupId){
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small you-avatar" title="${response.message.sender.name}" alt="">`;
            messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);
            divId = response.currentGroupId;
            if(response.currentUserId !== $("#dropdown-navbar-user").data('uid')){
                increaseNumberMessageGroup(divId);
            }
        }else{
            divId = response.currentUserId;
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small you-avatar" title="${response.message.sender.name}" alt="">`;
            messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);
        }
        
        //step 02 : append message data to screen
        if(response.currentUserId !== $("#dropdown-navbar-user").data('uid')){
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat = ${divId}]`).find("span.time").addClass('message-time-realtime');
        }
        // step 04 : change data preview $ time in leftSide 
        $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat = ${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

        //step 05 : move conversation to top
        $(`.person[data-chat = ${divId}]`).on('kysmile.moveConversationToTheTop',function(){
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("kysmile.moveConversationToTheTop");
        })
        $(`.person[data-chat = ${divId}]`).trigger('kysmile.moveConversationToTheTop');
    })
})