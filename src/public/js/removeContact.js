
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
                        // sau này làm chức năng CHAT thì sẽ xoá tiếp user ở phần CHAT
                        socket.emit('remove-contact',{contactId : targetID});
                        
                    }
                }
            })
        })
    });
}
socket.on('response-remove-contact',function(user){
    $('#contacts').find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotiContact("count-contacts");
})
$(document).ready(function(){
    removeContact();
})