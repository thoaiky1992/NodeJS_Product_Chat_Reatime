$(function(){
    $('#link-read-more-notify').bind('click',function(){
        let skipNumber = $('ul.list-notifications').find('li').length;
        $('#link-read-more-notify').css({'display':'none'});
        $('.red-more-notify-loader').css({'display':'inline-block'});
        setTimeout(() => {
            $.get(`/notification/read-more?skipNumber=${skipNumber}`,function(notifications){
                if(!notifications.length){
                    alertify.notify('Đã load hết tất cả thông báo !!!','error',7);
                    $('#link-read-more-notify').css({'display':'block'});
                    $('.red-more-notify-loader').css({'display':'none'});
                    return false;
                }
                notifications.forEach(function(notification){
                    $('ul.list-notifications').append(`<li>${notification}</li>`); // modal notifications
                })
                $('#link-read-more-notify').css({'display':'block'});
                $('.red-more-notify-loader').css({'display':'none'});
            })
        }, 1000);
        
    })
});