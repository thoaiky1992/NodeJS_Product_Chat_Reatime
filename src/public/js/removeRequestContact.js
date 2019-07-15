function removeRequestContact() {
    $('.user-remove-request-contact').bind('click',function(){
        let targetID = $(this).data('uid');
        $.ajax({
            url : '/contact/remove-request-contact',
            type : 'delete',
            data : {uid : targetID},
            success:function(data){
                if(data.success){
                    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetID}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid= ${targetID}]`).css({'display':'inline-block'});
                    decreaseNumberNotiContact("count-request-contact-sent")
                    // xử lý realtime
                }
            }
        })
    });
}