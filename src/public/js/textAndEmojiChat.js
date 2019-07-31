function textAndEmojiChat(divId){
    $(".emojionearea ").unbind('keyup').on('keyup',function(e){
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
                console.log(data.message)
            }).fail(function(response){
                console.log(response)
            })
        }
    })
}