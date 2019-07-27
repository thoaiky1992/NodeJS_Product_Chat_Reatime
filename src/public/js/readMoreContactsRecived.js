$(function(){
    $('#link-read-more-contact-recived').bind('click',function(){
        let skipNumber = $('#request-contact-received').find('li').length;
        $('#link-read-more-contact-recived').css({'display':'none'});
        $('.red-more-contact-recevied-loader').css({'display':'inline-block'});
        setTimeout(() => {
            $.get(`/contact/read-more-contacts-recieved?skipNumber=${skipNumber}`,function(newContactUsers){
                if(!newContactUsers.length){
                    alertify.notify('Đã load hết tất cả yêu cầu !!!','error',7);
                    $('#link-read-more-contact-recived').css({'display':'block'});
                    $('.red-more-contact-recevied-loader').css({'display':'none'});
                    return false;
                }
                newContactUsers.forEach(function(user){
                    $('#request-contact-received').find('ul').append(`<li class="_contactList" data-uid="${user._id}">
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
                            <span>&nbsp ${ (user.address !== null) ? user.address : "" }</span>
                        </div>
                        <div class="user-acccept-contact-received" data-uid="${user._id}">
                            Chấp nhận
                        </div>
                        <div class="user-reject-request-contact-received action-danger"
                            data-uid="${user._id}">
                            Xóa yêu cầu
                        </div>
                    </div>
                </li>`); 
                })
                $('#link-read-more-contact-recived').css({'display':'block'});
                $('.red-more-contact-recevied-loader').css({'display':'none'});
            })
        }, 1000);
        
    })
});