
function removeContact() {
    $('.user-remove-contact').unbind("click").on('click',function(){
        let targetID = $(this).data('uid');
        let username = $(this).parent().find("div.user-name p").text();
        Swal.fire({
            title: `Bạn có chắc chắn muốn xoá ${username} ra khỏi danh bạ không ?`,
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác Nhận',
            cancelButtonText: 'Huỷ Bỏ'
        }).then((result) => {
            if(!result.value){
                return false;
            }
            $.ajax({
                url : '/contact/remove-contact',
                type : 'delete',
                data : {uid : targetID},
                success:function(data){
                    if(data.success){
                        $('#contacts').find(`ul li[data-uid = ${targetID}]`).remove();
                        decreaseNumberNotiContact("count-contacts");
                        socket.emit('remove-contact',{contactId : targetID});
                        //step 0 : check active
                        let checkActive = $("#all-chat").find(`li[data-chat = ${targetID}]`).hasClass('active');
                        //step 01 : remove leftSide.ejs
                        $('#all-chat').find(`ul a[href="#uid_${targetID}"]`).remove();
                        $('#user-chat').find(`ul a[href="#uid_${targetID}"]`).remove();
                        //step 02 : remove rightSide.ejs
                        $('#screen-chat').find(`div#to_${targetID}`).remove();
                        //step 03 : remove imageModal
                        $('body').find(`div#imagesModal_${targetID}`).remove();
                        //step 04 : remove attachmentModal
                        $('body').find(`div#attachmentsModal_${targetID}`).remove();
                        //step 05 : click first conversation
                        if(checkActive){
                            $('ul.people').find("a")[0].click();
                        }
                        
                    }
                }
            })
        })
    });
}
socket.on('response-remove-contact',function(user){
    $('#contacts').find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotiContact("count-contacts");
    //step 0 : check active
    let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass('active');
    // step 01 : remove leftSide.ejs
    $('#all-chat').find(`ul a[href="#uid_${user.id}"]`).remove();
    $('#user-chat').find(`ul a[href="#uid_${user.id}"]`).remove();
    //step 02 : remove rightSide.ejs
    $('#screen-chat').find(`div#to_${user.id}`).remove();
    //step 03 : remove imageModal
    $('body').find(`div#imagesModal_${user.id}`).remove();
    //step 04 : remove attachmentModal
    $('body').find(`div#attachmentsModal_${user.id}`).remove();
    //step 05 : click first conversation
    if(checkActive){
        $('ul.people').find("a")[0].click();
    }
})
$(document).ready(function(){
    removeContact();
})