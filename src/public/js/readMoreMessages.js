function readMoreMessages(){
    $('.right .chat').scroll(function(){
        if($(this).scrollTop() === 0){
            let messageLoading = `<img class="message-loading" src="images/icon_typing/message-loading.gif" />`;
            $(this).prepend(messageLoading);
            let targetId = $(this).data('chat');
            let skipMessage = $(this).find('div.bubble').length;
            let chatInGroup = $(this).hasClass('chat-in-group') ? true : false;
            let thiss = $(this);
            //get the first message
            let firstMessage = $(this).find('.bubble:first')
            //get position of firstMessage
            let currentOffset = firstMessage.offset().top - $(this).scrollTop();
            setTimeout(() => {
                $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`,function(data){               
                    if(data.rightSideData.trim() == ''){
                        alertify.notify('Đã load hết tất cả tin nhắn trong cuộc trò chuyện này !!!','error',7);
                        thiss.find("img.message-loading").remove();
                        return false;
                    }
                    //step 01 : handle rightSide 
                    $(`.right .chat[data-chat = ${targetId}]`).prepend(data.rightSideData);
                    //step 02 : prevent scroll
                    $(`.right .chat[data-chat = ${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset)
                    //step 03 : convert emoji
                    convertEmoji();
                    //step 04 : handle imageModal
                    $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);
                    //Step 05 : call function gridPhotos
                    gridPhotos(5)
                    //step 06 : hanle attachmentModal
                    $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);
                    //step 07 : remove message loading
                    thiss.find("img.message-loading").remove();
                })
            }, 1000);
        }
    })
}
$(document).ready(function(){
    readMoreMessages();
})