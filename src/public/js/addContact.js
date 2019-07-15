function addContact() {
    $('.user-add-new-contact').bind('click',function(){
        let targetID = $(this).data('uid');
        $.post('/contact/add-new',{uid : targetID},function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetID}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid= ${targetID}]`).css({'display':'inline-block'});
                increaseNumberNotiContact("count-request-contact-sent");
                // xử lý realtime
            }
        })
    });
}
