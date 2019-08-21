$(function(){
    $('#link-read-more-group-chat').bind('click',function(){
        let skipGroup = $('#group-chat').find('li').length;
        $('#link-read-more-group-chat').css({'display':'none'});
        $('.red-more-group-chat-loader').css({'display':'inline-block'});
        setTimeout(() => {
            $.get(`/message/read-more-group-chat?skipGroup=${skipGroup}`,function(data){
                if(data.leftSideData.trim() == ''){
                    alertify.notify('Đã load hết tất cả cuộc trò chuyện !!!','error',7);
                    $('#link-read-more-group-chat').css({'display':'block'});
                    $('.red-more-group-chat-loader').css({'display':'none'});
                    return false;
                }
                //step 01 : handle lifeSide
                $('#group-chat').find("ul").append(data.leftSideData);
                //step 02 : handle scroll left
                resizeNineScrollLeft();
                nineScrollLeft();
                //step 03 : handle rightSide
                $('#screen-chat').append(data.rightSideData);
                //step 04 : call function screenChat
                changeScreenChat();
                //step 05 : convert emoji
                convertEmoji();
                //step 06 : hanle imageModal
                $('body').append(data.imageModalData);
                // Step 07 : call function gridPhotos
                gridPhotos(5);
                //step 08 : handle attmentModal
                $('body').append(data.attachmentData);
                // Step 09 : update online
                socket.emit('check-status');
                $('#link-read-more-group-chat').css({'display':'inline-block'});
                $('.red-more-group-chat-loader').css({'display':'none'});
                //step 10 : call function readMoreMessages
                readMoreMessages();
            })
        }, 1000);
        
    })
});