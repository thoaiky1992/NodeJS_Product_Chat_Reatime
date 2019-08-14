$(function(){
    $('#link-read-more-all-chat').bind('click',function(){
        let skipPersonal = $('#all-chat').find('li:not(.group-chat)').length;
        let skipGroup = $('#all-chat').find('li.group-chat').length;
        $('#link-read-more-all-chat').css({'display':'none'});
        $('.red-more-all-chat-loader').css({'display':'inline-block'});
        setTimeout(() => {
            $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`,function(data){
                if(data.leftSideData.trim() == ''){
                    alertify.notify('Đã load hết tất cả cuộc trò chuyện !!!','error',7);
                    $('#link-read-more-all-chat').css({'display':'block'});
                    $('.red-more-all-chat-loader').css({'display':'none'});
                    return false;
                }
                //step 01 : handle lifeSide
                $('#all-chat').find("ul").append(data.leftSideData);
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
                $('#link-read-more-all-chat').css({'display':'inline-block'});
                $('.red-more-all-chat-loader').css({'display':'none'});
                //step 10 : call function readMoreMessages
                readMoreMessages();
            })
        }, 1000);
        
    })
});