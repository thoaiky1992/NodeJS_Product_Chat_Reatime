$(document).ready(function(){
  $(document).on('click','.number-members',function(){
    let targetId = $(this).parent().parent().parent().data('chat');
    let groupName = $(this).parent().parent().parent().find('.name').text();
    $('#detailGroupModal').find('.modal-title').html(`Group : ${groupName}`);
    $.get(`/contact/user-in-group?targetId=${targetId}`,function(data){
        $('.contactListUserInGroup').html(data);
    })
  })
  $(document).on('click','.chat-to-user',function(){
    let targetId = $(this).data('uid');
    let userName = $(this).parent().find('.user-name>p').text().trim();
    let address = $(this).parent().find('.user-address>span').text().trim();
    let avatar = $(this).parent().find('.user-avatar>img').attr('src');
    // khi 2 người đã là bạn bè
    if($(`#user-chat ul`).find(`.person[data-chat = ${targetId}]`).length){
      $('#contactsModal').modal('hide');
      $(`.person[data-chat = ${targetId}]`).on('kysmile.moveConversationToTheTop',function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("kysmile.moveConversationToTheTop");
      })
      $(`.person[data-chat = ${targetId}]`).trigger('kysmile.moveConversationToTheTop');
      $('ul.people').find("a")[0].click();
      $('#detailGroupModal').modal('hide');
    }
    else{
      $.get(`/contact/check-friend?targetId=${targetId}`,function(data){
        // khi chưa là bạn bè
        if(!data){
          Swal.fire({
            title: `Bạn và "${userName}" vẫn chưa phải là bạn bè nên không thể trò chuyện được !!!`,
            text : `Bạn có muốn thêm "${userName}" vào danh sách bạn bè luôn không ???? `,      
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
          $.post('/contact/add-new',{uid : targetId},function(data){
              if(data.success){
                swal.fire({
                  title: `Bạn đã gửi thành công lời mời kết bạn tới "${userName}" !!!`,
                  text : 'Vui lòng chờ bạn ấy xác nhận nhé ...',
                  type: "success",
                  confirmButtonText: "OK",
                });
                increaseNumberNotification("noti_contact_counter",1); // js/caculateNotification
                increaseNumberNotiContact("count-request-contact-sent"); // js/caculateNotiContact
                // thêm ở modal tab đang chờ xác nhận
                let userInfoHtml = `<li class="_contactList" data-uid="${targetId}">
                    <div class="contactPanel">
                        <div class="user-avatar">
                            <img src="${avatar}" alt="">
                        </div>
                        <div class="user-name">
                            <p>
                                ${userName}
                            </p>
                        </div>
                        <br>
                        <div class="user-address">
                            <span>&nbsp ${address}</span>
                        </div>
                        <div class="user-add-new-contact" style="display:none;" data-uid="${targetId}">
                            Thêm vào danh sách liên lạc
                        </div>
                        <div class="user-remove-request-contact-sent action-danger" style="display:inline-block;" data-uid="${targetId}">
                            Hủy yêu cầu
                        </div>
                    </div>
                </li>`;
                $('#request-contact-sent').find('ul').prepend(userInfoHtml);
                removeRequestContactSent();
                socket.emit('add-new-contact' , {contactId : targetId});
              }
            })
          });
        }
        else{
            // đã kết bạn nhưng chưa người ấy chưa đồng ý 
            swal.fire({
                title: `"${userName}" vẫn chưa chấp nhận lời mời kết bạn !!!`,
                type: "warning",
                confirmButtonText: "OK",
            });
        }
      })  
    }
  })
})