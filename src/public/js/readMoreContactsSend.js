$(function(){
    $('#link-read-more-contact-sent').bind('click',function(){
        let skipNumber = $('#request-contact-sent').find('li').length;
        $('#link-read-more-contact-sent').css({'display':'none'});
        $('.red-more-contacts-send-loader').css({'display':'inline-block'});
        setTimeout(() => {
            $.get(`/contact/read-more-contacts-sent?skipNumber=${skipNumber}`,function(newContactUsers){
                if(!newContactUsers.length){
                    alertify.notify('Đã load hết tất cả danh sách !!!','error',7);
                    $('#link-read-more-contact-sent').css({'display':'block'});
                    $('.red-more-contacts-send-loader').css({'display':'none'});
                    return false;
                }
                newContactUsers.forEach(function(user){
                    $('#request-contact-sent').find('ul').append(`<li class="_contactList" data-uid="${user._id}">
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
                            <span>&nbsp ${(user.username !==null) ? user.username : "" }</span>
                        </div>
                        <div class="user-remove-request-contact-sent display-important action-danger" data-uid="${user._id}">
                            Hủy yêu cầu
                        </div>
                    </div>
                </li>`); 
                })
                
                removeRequestContactSent();

                $('#link-read-more-contact-sent').css({'display':'block'});
                $('.red-more-contacts-send-loader').css({'display':'none'});
            })
        }, 1000);
        
    })
});